'use client';
import React, { useEffect, useState } from 'react';
import { getUsers, User } from '@/app/services/users';
import Loading from '@/app/dashboard/loading';
import RenderUserDashboard from '@/app/ui/dashboard/render-user-dashboard';
import PaginationControls from '@/app/ui/dashboard/pagination-controls';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getUsers(currentPage, usersPerPage);
        setUsers(data.users);
        setTotalPage(data.total_pages);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, [currentPage, usersPerPage]);

  const handleNextPage = () => {
    setCurrentPage((page) => page + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };
  const handleFirstPage = () => {
    setCurrentPage((page) => 1);
  };
  const handleLastPage = () => {
    setCurrentPage((page) => totalPage);
  };

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
  return (
    <>
      <PaginationControls
        currentPage={currentPage}
        totalPage={totalPage}
        onFirstPage={handleFirstPage}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onLastPage={handleLastPage}
      />
      {isLoading ? (
        <Loading usersPerPage={usersPerPage} />
      ) : (
        <RenderUserDashboard
          users={users}
          onDisable={handleDisable}
          onEnable={handleEnable}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
