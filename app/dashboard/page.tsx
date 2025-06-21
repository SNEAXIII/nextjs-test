'use client';
import React, { useEffect, useState } from 'react';
import { getUsers, User } from '@/app/services/users';
import Loading from '@/app/dashboard/loading';
import RenderUserDashboard from '@/app/ui/dashboard/render-user-dashboard';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data.users);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleDisable = async (userId: string) => {
    try {
      console.log("Désactivation de l'utilisateur:", userId);
      // TODO: Implémenter l'action de désactivation
    } catch (error) {
      console.error('Erreur lors de la désactivation:', error);
    }
  };

  const handleEnable = async (userId: string) => {
    try {
      console.log("Activation de l'utilisateur:", userId);
      // TODO: Implémenter l'action d'activation
    } catch (error) {
      console.error("Erreur lors de l'activation:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      console.log("Suppression de l'utilisateur:", userId);
      // TODO: Implémenter l'action de suppression
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <RenderUserDashboard
      users={users}
      onDisable={handleDisable}
      onEnable={handleEnable}
      onDelete={handleDelete}
    />
  );
}
