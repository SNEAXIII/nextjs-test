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

export interface LoginResponse extends User {
  access_token: string;
  token_type: string;
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
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json',
    },
    body: formData,
    cache: 'no-store',
  });

  // Essayer de parser la réponse en JSON
  let data;
  try {
    data = await response.json();
    
    if (!response.ok) {
      // Si l'API renvoie un message d'erreur, on l'utilise
      throw new Error(data?.message || data?.detail || 'Identifiants invalides');
    }
    
    // Vérifier la présence du token d'accès
    if (!data.access_token) {
      throw new Error('Token d\'accès manquant dans la réponse');
    }

    // Vérifier le type de token
    const tokenType = data.token_type?.toLowerCase();
    if (tokenType !== 'bearer') {
      throw new Error(`Type de token non supporté: ${data.token_type}`);
    }
    
    return data;
  } catch (error) {
    // En cas d'erreur de parsing JSON ou autre, on renvoie un message générique
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur lors de la connexion');
  }

};
