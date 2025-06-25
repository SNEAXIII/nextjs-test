import type { DefaultSession, NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { loginForAccessToken } from '@/app/services/users';
import { parseJwt } from '@/app/lib/utils';

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
  id?: string;  // Rendre id optionnel pour correspondre au type de base
  name?: string | null;
  email?: string | null;
  image?: string | null;
  login?: string;
  role?: string;
  accessToken?: string;
};

type Token = {
  id: string;
  email?: string | null;
  name?: string | null;
  login?: string;
  role?: string;
  accessToken?: string;
  [key: string]: any; // Pour les autres propriétés du token
};

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || 'your-secret-key',
  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 heures
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
          label: 'Login', 
          type: 'text', 
          placeholder: "Saisissez votre nom d'utilisateur" 
        },
        password: { 
          label: 'Password', 
          type: 'password', 
          placeholder: 'Votre mot de passe' 
        },
      },
      async authorize(credentials) {
        try {
          console.log('Credentials reçus:', credentials);
          
          const parsedCredentials = z
            .object({ 
              username: z.string().min(1, 'Le nom d\'utilisateur est requis'),
              password: z.string().min(1, 'Le mot de passe est requis') 
            })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            console.error('Format des identifiants invalide:', parsedCredentials.error);
            return null;
          }

          const { username: userLogin, password } = parsedCredentials.data;
          const response = await loginForAccessToken(userLogin, password);
          
          if (!response?.access_token) {
            console.error('Échec de l\'obtention du token d\'accès');
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

          // Créer l'objet utilisateur avec les informations du token
          const user: User = {
            id: tokenPayload.sub,
            name: tokenPayload.sub, // Utilisé pour la compatibilité avec NextAuth
            email: tokenPayload.email || null,
            login: tokenPayload.sub,
            role: tokenPayload.role || 'user',
            accessToken: token,
          };

          return user;
        } catch (error) {
          console.error('Échec de l\'authentification:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Type assertion pour éviter les erreurs TypeScript
        const jwtToken = token as Token;
        const userData = user as User;
        
        jwtToken.id = userData.id;
        jwtToken.email = userData.email ?? null;
        jwtToken.name = userData.name ?? null;
        jwtToken.login = userData.login || userData.email?.split('@')[0];
        jwtToken.role = userData.role || 'user';
        jwtToken.accessToken = userData.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      const jwtToken = token as Token;
      
      if (session.user) {
        session.user.id = jwtToken.id;
        if (jwtToken.email) session.user.email = jwtToken.email;
        if (jwtToken.name) session.user.name = jwtToken.name;
        if (jwtToken.login) (session as any).user.login = jwtToken.login;
        if (jwtToken.role) (session as any).user.role = jwtToken.role;
      }
      
      if (jwtToken.accessToken) {
        (session as any).accessToken = jwtToken.accessToken;
      }
      
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
