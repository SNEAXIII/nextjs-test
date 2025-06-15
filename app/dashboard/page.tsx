"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";

interface User {
  login: string;
  email: string;
  role: string;
  id: string;
  created_at: string;
  last_login_date: string | null;
  disabled: boolean;
  deleted: boolean;
}
const UserCard: React.FC<User> = ({
  login,
  email,
  role,
  id,
  created_at,
  last_login_date,
  disabled,
  deleted,
}) => {
  return (
    <TableRow>
      <TableCell className="font-semibold">{login}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell>{new Date(created_at).toLocaleString()}</TableCell>
      <TableCell>
        {last_login_date
          ? new Date(last_login_date).toLocaleString()
          : "Jamais"}
      </TableCell>
      <TableCell>
        {deleted ? "Supprimé" : disabled ? "Désactivé" : "Activé"}
      </TableCell>
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
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/admin/users?page=1&size=10",
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzQ5OTA2Mjg4fQ.sIlESn-ge-7Z5D0lNu9BINDT6GCZVV0Au7x4xcsC0RU",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users);
        setTotalUsers(data.total_users);
        setTotalPages(data.total_pages);
        setCurrentPage(data.current_page);
      } catch (err: any) {
        setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users: {error}</p>;

  return (
    <div className="p-4">
      {/* <Pagination /> */}
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="space-y-2">
        <div className="total_pages">Nombre d'utilisateurs : {totalUsers}</div>
        <div className="total_pages">Nombre de pages : {totalPages}</div>
        <div className="current_page">Page actuelle : {currentPage}</div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Pseudonyme</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Création</TableHead>
              <TableHead>Derniere connexion</TableHead>
              <TableHead>Etat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserCard key={user.id} {...user} />
            ))}
          </TableBody>
        </Table>
      </ul>
    </div>
  );
};

export default UserList;
