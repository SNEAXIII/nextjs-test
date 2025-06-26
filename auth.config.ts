import type { DefaultSession, NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { loginForAccessToken } from '@/app/services/users';
import { parseJwt } from '@/app/lib/utils';

// Déclarer le type process pour éviter les erreurs TypeScript
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
    AUTH_SECRET?: string;
  };
};

// Étendre les types de Session pour inclure nos champs personnalisés
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      login?: string;
      role?: string;
    } & DefaultSession['user'];
    accessToken?: string;
  }
}

// Définition du type User compatible avec NextAuth
type User = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  login?: string;
  role?: string;
  accessToken?: string;
};

export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        login: {
          type: 'text',
        },
        password: {
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          console.log('Tentative de connexion avec les identifiants reçus');
          
          // Validation des champs obligatoires
          if (!credentials?.login || !credentials?.password) {
            console.error('Identifiants manquants');
            throw new Error('Nom d\'utilisateur et mot de passe requis');
          }

          // Validation du format des identifiants avec Zod
          const validation = z.object({
            username: z.string().min(1, "Le nom d'utilisateur est requis"),
            password: z.string().min(1, 'Le mot de passe est requis'),
          }).safeParse({
            username: credentials.login,
            password: credentials.password,
          });

          if (!validation.success) {
            const errorMessage = validation.error.errors.map(err => err.message).join('. ');
            console.error('Validation des identifiants échouée:', errorMessage);
            throw new Error(errorMessage);
          }

          const { username: userLogin, password } = validation.data;
          
          console.log('Tentative d\'authentification pour:', userLogin);
          
          // Appel à l'API d'authentification
          const response = await loginForAccessToken(userLogin, password)
            .catch((error) => {
              console.error('Erreur lors de l\'appel à loginForAccessToken:', error);
              // Propager l'erreur avec un message convivial
              if (error instanceof Error) {
                throw new Error(`Échec de l'authentification: ${error.message}`);
              }
              throw new Error('Une erreur inconnue est survenue lors de la connexion');
            });

          // Vérification de la réponse de l'API
          if (!response?.access_token) {
            console.error('Réponse invalide du serveur:', response);
            throw new Error('Réponse invalide du serveur d\'authentification');
          }

          // Décodage et validation du token JWT
          const token = response.access_token;
          const tokenPayload = parseJwt(token);
          
          if (!tokenPayload) {
            console.error('Impossible de décoder le token JWT');
            throw new Error('Erreur de traitement du jeton d\'authentification');
          }

          // Vérification de l'expiration du token
          const currentTime = Math.floor(Date.now() / 1000);
          if (tokenPayload.exp && tokenPayload.exp < currentTime) {
            console.error('Token expiré');
            throw new Error('La session a expiré. Veuillez vous reconnecter.');
          }

          const user: User = {
            id: tokenPayload.sub,
            name: tokenPayload.sub, // Used by NextAuth for compatibilty
            email: tokenPayload.email || null,
            login: tokenPayload.sub,
            role: tokenPayload.role || 'user',
            accessToken: token,
          };

          return user;
        } catch (error) {
          console.error("Échec de l'authentification:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as User;
        if (typedUser.id) token.id = typedUser.id;
        if (typedUser.accessToken) token.accessToken = typedUser.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
