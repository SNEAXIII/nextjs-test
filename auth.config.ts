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
          console.log('Credentials reçus:', credentials);

          const parsedCredentials = z
            .object({
              username: z.string().min(1, "Le nom d'utilisateur est requis"),
              password: z.string().min(1, 'Le mot de passe est requis'),
            })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            console.error('Format des identifiants invalide:', parsedCredentials.error);
            return null;
          }

          const { username: userLogin, password } = parsedCredentials.data;
          const response = await loginForAccessToken(userLogin, password).catch((error) => {
            // Si l'erreur contient un message, on le propage
            if (error instanceof Error) {
              throw error;
            }
            // Sinon, on lance une erreur générique
            throw new Error('Échec de la connexion');
          });

          if (!response?.access_token) {
            // Type assertion pour accéder à la propriété detail
            const errorResponse = response as { detail?: string };
            // Si la réponse contient un message d'erreur, on le retourne
            if (errorResponse?.detail) {
              throw new Error(errorResponse.detail);
            }
            console.error("Échec de l'obtention du token d'accès");
            return null;
          }

          const token = response.access_token;
          const tokenPayload = parseJwt(token);

          // Vérifier si le token est expiré
          const currentTime = Math.floor(Date.now() / 1000);
          if (tokenPayload.exp < currentTime) {
            console.error('Token expiré');
            return null;
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
