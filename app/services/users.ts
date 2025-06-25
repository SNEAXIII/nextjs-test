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
  
  // Essayer d'abord avec x-www-form-urlencoded
  try {
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

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Erreur de login (form-urlencoded):', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      throw new Error(data.detail || 'Identifiants invalides');
    }

    if (!data.access_token) {
      throw new Error('Token d\'accès manquant dans la réponse');
    }

    return {
      access_token: data.access_token,
      token_type: data.token_type || 'bearer',
    };
  } catch (error) {
    console.error('Erreur avec form-urlencoded, tentative avec JSON:', error);
    
    // Si la première méthode échoue, essayer avec JSON
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        cache: 'no-store',
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Erreur de login (JSON):', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(data.detail || 'Identifiants invalides');
      }

      if (!data.access_token) {
        throw new Error('Token d\'accès manquant dans la réponse');
      }

      return {
        access_token: data.access_token,
        token_type: data.token_type || 'bearer',
      };
    } catch (jsonError) {
      console.error('Échec des deux méthodes d\'authentification:', jsonError);
      throw new Error('Échec de l\'authentification. Vérifiez vos identifiants et réessayez.');
    }
  }
};
