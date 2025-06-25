import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { loginForAccessToken } from '@/app/services/users'; // Import the login function
import { authConfig } from './auth.config';
import { parseJwt } from '@/app/lib/utils';



export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  
});
