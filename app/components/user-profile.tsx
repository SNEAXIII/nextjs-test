'use client';

import { useEffect, useState } from 'react';
import { UserSession } from '@/app/services/auth';

export default function UserProfile() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/session');
        
        if (!response.ok) {
          if (response.status === 401) {
            setUser(null);
            return;
          }
          throw new Error('Erreur lors de la récupération des informations utilisateur');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-600">Chargement des informations utilisateur...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Erreur: {error}</div>;
  }

  if (!user) {
    return <div className="p-4 text-gray-600">Aucun utilisateur connecté</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Profil Utilisateur</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-700">ID:</span>
            <span className="ml-2 text-gray-900">{user.user.id}</span>
          </div>
          {user.user.name && (
            <div>
              <span className="font-medium text-gray-700">Nom:</span>
              <span className="ml-2 text-gray-900">{user.user.name}</span>
            </div>
          )}
          {user.user.login && (
            <div>
              <span className="font-medium text-gray-700">Login:</span>
              <span className="ml-2 text-gray-900">{user.user.login}</span>
            </div>
          )}
          {user.user.email && (
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <span className="ml-2 text-gray-900">{user.user.email}</span>
            </div>
          )}
          {user.user.role && (
            <div>
              <span className="font-medium text-gray-700">Rôle:</span>
              <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                {user.user.role}
              </span>
            </div>
          )}
          <div className="pt-2 text-sm text-gray-500">
            Session expire le: {new Date(user.expires).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
