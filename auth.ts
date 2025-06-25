import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { loginForAccessToken } from '@/app/services/users'; // Import the login function
import { authConfig } from './auth.config';
import { parseJwt } from '@/app/lib/utils';

interface UserPayload {
  login: string;
  email: string;
  role: string;
  exp: number;
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        login: { label: 'Login', type: 'text', placeholder: "Saisissez votre nom d'utilisateur" },
        password: { label: 'Password', type: 'password', placeholder: 'Votre mot de passe' },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ login: z.string(), password: z.string() })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log('Invalid credentials format');
          return null;
        }

        const { login: userLogin, password } = parsedCredentials.data;

        try {
          const response = await loginForAccessToken(userLogin, password);
          const token = response.access_token;

          if (!response || !token) {
            console.log('Failed to obtain access token');
            return null;
          }

          const tokenPayload = parseJwt(token);
          const user: UserPayload = {
            login: tokenPayload.sub,
            email: tokenPayload.email,
            role: tokenPayload.role,
            exp: tokenPayload.exp,
          };

          return user;
        } catch (error) {
          console.error('Authentication failed:', error);
          return null;
        }
      },
    }),
  ],
});
