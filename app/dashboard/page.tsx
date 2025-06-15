'use client';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useEffect, useState } from 'react';
import Loading from '@/app/dashboard/loading';
import { fetchUsers, User } from '@/app/services/users';
import { UserRow } from '@/components/dashboard/UserRow';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
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
      console.log("Enculé");
      console.log("Désactivation de l'utilisateur:", userId);
      // TODO FAIRE CA
    } catch (error) {
      console.error('Erreur lors de la désactivation: ', error);
    }
  };
  const handleEnable = async (userId: string) => {
    try {
      console.log("Salope");
      console.log("Activation de l'utilisateur:", userId);
      // TODO FAIRE CA
    } catch (error) {
      console.error("Erreur lors de l'activation:", error);
    }
  };
  const handleDelete = async (userId: string) => {
    try {
      console.log("Suppression de l'utilisateur:", userId);
      // TODO FAIRE CA
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className='container mx-auto py-6'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Login</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Création</TableHead>
            <TableHead>Dernière connexion</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className='w-[50px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onDisable={handleDisable}
              onEnable={handleEnable}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
