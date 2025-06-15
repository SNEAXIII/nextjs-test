'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';
import Loading from '@/app/dashboard/loading';
import { fetchUsers, FetchUsersResponse, User } from '@/app/services/users';
import { formatDateInFrenchShort, truncateString } from '@/app/lib/utils';

const UserRow: React.FC<
  User & {
    onClick?: () => void;
    className?: string;
  }
> = ({
  login,
  email,
  role,
  created_at,
  last_login_date,
  disabled,
  deleted,
  onClick,
  className,
}) => {
  return (
    <TableRow
      onClick={onClick}
      className={className}
    >
      <TableCell className='font-semibold'>{truncateString(login, 15)}</TableCell>
      <TableCell>{truncateString(email, 15)}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell>{formatDateInFrenchShort(created_at)}</TableCell>
      <TableCell>{last_login_date ? formatDateInFrenchShort(last_login_date) : 'Jamais'}</TableCell>
      <TableCell>{deleted ? 'Supprimé' : disabled ? 'Désactivé' : 'Activé'}</TableCell>
    </TableRow>
  );
};
const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data: FetchUsersResponse = await fetchUsers();
        setUsers(data.users);
        setTotalUsers(data.total_users);
        setTotalPages(data.total_pages);
        setCurrentPage(data.current_page);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>Error loading users: {error}</p>;

  return (
    <div className='p-4'>
      {/* <Pagination /> */}
      <h1 className='text-2xl font-bold mb-4'>User List</h1>
      <ul className='space-y-2'>
        <div className='total_pages'>Nombre d'utilisateurs : {totalUsers}</div>
        <div className='total_pages'>Nombre de pages : {totalPages}</div>
        <div className='current_page'>Page actuelle : {currentPage}</div>
        <Table>
          <TableHeader className='display:sticky'>
            <TableRow>
              <TableHead>Pseudonyme</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Création</TableHead>
              <TableHead>Dernière connexion</TableHead>
              <TableHead>Etat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserRow
                onClick={() => console.log(user.id)}
                className='cursor-pointer hover:bg-gray-100 transition'
                key={user.id}
                {...user}
              />
            ))}
          </TableBody>
        </Table>
      </ul>
    </div>
  );
};

export default UserList;
