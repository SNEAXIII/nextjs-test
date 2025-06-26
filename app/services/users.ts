import { possibleRoles, possibleStatus } from '@/app/ui/dashboard/table/table-header';

export interface User {
  login: string;
  email: string;
  role: string;
  id: string;
  created_at: string;
  last_login_date: string | null;
  disabled_at: boolean;
  deleted_at: boolean;
}

interface LoginResponseData {
  access_token: string;
  token_type: string;
  detail?: string;
  message?: string;
}

export interface FetchUsersResponse {
  users: User[];
  total_users: number;
  total_pages: number;
  current_page: number;
}

export const getUsers = async (
  page: number = 1,
  size: number = 10,
  status: string | null = null,
  role: string | null = null
): Promise<FetchUsersResponse> => {
  const query_status = status && status !== possibleStatus[0].value ? `&status=${status}` : '';
  const query_role = role && role !== possibleRoles[0].value ? `&role=${role}` : '';
  const url = `http://127.0.0.1:8000/admin/users?page=${page}&size=${size}${query_status}${query_role}`;
  const headers = {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzQ5OTA2Mjg4fQ.sIlESn-ge-7Z5D0lNu9BINDT6GCZVV0Au7x4xcsC0RU',
  };
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status} Error: ${response.statusText}`);
  }
  return response.json();
};



export const loginForAccessToken = async (
  username: string,
  password: string
): Promise<{ access_token: string; token_type: string }> => {
  const url = 'http://localhost:8000/auth/login';
  
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
      },
      body: formData,
      cache: 'no-store',
    });

    const data: LoginResponseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Gestion des erreurs HTTP (401, 400, etc.)
      const errorMessage = data?.detail || data?.message || 'Identifiants invalides';
      console.error('Erreur de connexion:', {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
    
    // Vérification du token
    if (!data?.access_token) {
      console.error('Token manquant dans la réponse:', data);
      throw new Error('Réserve invalide du serveur: token manquant');
    }

    // Vérification du type de token
    const tokenType = data.token_type?.toLowerCase();
    if (tokenType !== 'bearer') {
      console.error('Type de token invalide:', tokenType);
      throw new Error('Type de token non supporté');
    }
    
    return {
      access_token: data.access_token,
      token_type: data.token_type
    };
  } catch (error) {
    // Journalisation de l'erreur complète pour le débogage
    console.error('Erreur lors de la tentative de connexion:', error);

    // Renvoyer une erreur plus conviviale pour l'utilisateur
    if (error instanceof Error) {
      // Si c'est déjà une erreur avec un message, on la propage
      throw error;
    }

    // Pour les erreurs inattendues
    throw new Error('Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.');
  }
};
