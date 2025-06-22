'use client';
import React, { useEffect, useState } from 'react';
import { getUsers, User } from '@/app/services/users';
import Loading from '@/app/dashboard/loading';
import RenderUserDashboard from '@/app/ui/dashboard/render-user-dashboard';
import PaginationControls from '@/app/ui/dashboard/pagination/pagination-controls';
import { possibleRoles, possibleStatus } from '@/app/ui/dashboard/table-header';
const BASE_CURRENT_PAGE = 1;
const BASE_TOTAL_PAGE = 1;
const BASE_USERS_PER_PAGE = 10;
const BASE_SELECTED_STATUS = possibleStatus[0].value;
const BASE_SELECTED_ROLE = possibleRoles[0].value;
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(BASE_CURRENT_PAGE);
  const [totalPage, setTotalPage] = useState(BASE_TOTAL_PAGE);
  const [usersPerPage, setUsersPerPage] = useState(BASE_USERS_PER_PAGE);
  const [selectedStatus, setSelectedStatus] = useState(BASE_SELECTED_STATUS);
  const [selectedRole, setSelectedRole] = useState(BASE_SELECTED_ROLE);

  function resetPagination() {
    setCurrentPage(BASE_CURRENT_PAGE);
    setTotalPage(BASE_TOTAL_PAGE);
    setUsersPerPage(BASE_USERS_PER_PAGE);
    setSelectedStatus(BASE_SELECTED_STATUS);
    setSelectedRole(BASE_SELECTED_ROLE);
  }

  function goToPage1() {
    setCurrentPage(1);
  }

  function handleRadioSetUsersPerPage(value: string) {
    setUsersPerPage(Number(value));
    goToPage1();
  }

  function handleRadioSetSelectedStatus(value: string) {
    setSelectedStatus(value);
    goToPage1();
  }

  function handleRadioSetSelectedRole(value: string) {
    setSelectedRole(value);
    goToPage1();
  }

  useEffect(() => {
    const loadUsers = async () => {
      if (!users) {
        setIsLoading(true);
      }
      try {
        const data = await getUsers(currentPage, usersPerPage, selectedStatus, selectedRole);
        setUsers(data.users);
        setTotalPage(data.total_pages);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, [currentPage, usersPerPage, selectedStatus, selectedRole]);
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
        usersPerPage={usersPerPage}
        onUserPerPageChange={handleRadioSetUsersPerPage}
        onFirstPage={handleFirstPage}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onLastPage={handleLastPage}
        onResetPagination={resetPagination}
      />
      {isLoading ? (
        <Loading usersPerPage={usersPerPage} />
      ) : (
        <RenderUserDashboard
          users={users}
          role={selectedRole}
          onRoleChange={handleRadioSetSelectedRole}
          status={selectedStatus}
          onStatusChange={handleRadioSetSelectedStatus}
          onDisable={handleDisable}
          onEnable={handleEnable}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
