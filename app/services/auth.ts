import { auth } from '@/auth';

export interface UserSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    login?: string;
  };
  expires: string;
}

/**
 * Récupère les informations de la session utilisateur actuelle
 * Fonction côté serveur uniquement
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const session = await auth();
    
    if (!session) {
      console.log('Aucune session utilisateur active');
      return null;
    }

    return {
      user: {
        id: session.user?.id || '',
        name: session.user?.name || null,
        email: session.user?.email || null,
        role: session.user?.role,
        login: session.user?.login,
      },
      expires: session.expires
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la session utilisateur:', error);
    return null;
  }
}

/**
 * Vérifie si l'utilisateur actuel a un rôle spécifique
 * Fonction côté serveur uniquement
 */
export async function userHasRole(requiredRole: string): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.user?.role === requiredRole;
}

/**
 * Vérifie si un utilisateur est connecté
 * Fonction côté serveur uniquement
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

export default {
  getCurrentUser,
  userHasRole,
  isAuthenticated,
};
