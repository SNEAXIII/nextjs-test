'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';



type AuthState = string | { success?: boolean; redirectTo?: string; error?: string } | undefined;

export async function authenticate(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const result = await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    if (result?.error) {
      console.error('Erreur de connexion:', result.error);
      return result.error;
    }

    // Retourner l'URL de redirection pour que le client effectue la redirection
    const callbackUrl = formData.get('redirectTo')?.toString() || '/dashboard';
    return { success: true, redirectTo: callbackUrl };
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    if (error instanceof AuthError) {
      const errorType = error.type as string;
      if (errorType === 'CredentialsSignin') {
        return "Le nom d'utilisateur ou le mot de passe sont incorrect";
      } else {
        return 'Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.';
      }
    }

    if (error instanceof Error) {
      return error.message || 'Une erreur inattendue est survenue.';
    }

    return 'Une erreur inattendue est survenue. Veuillez réessayer.';
  }
}
