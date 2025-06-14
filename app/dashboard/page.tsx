"use client"
import React, { useEffect, useState } from 'react';

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

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/admin/users?page=1&size=10", {
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzQ5OTA2Mjg4fQ.sIlESn-ge-7Z5D0lNu9BINDT6GCZVV0Au7x4xcsC0RU",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err: any) {
        setError(err.message);
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
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 bg-gray-100 rounded-xl shadow-md hover:bg-gray-200 transition"
          >
            <p className="font-semibold">Login: {user.login}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Created At: {new Date(user.created_at).toLocaleString()}</p>
            <p>
              Last Login: {user.last_login_date ? new Date(user.last_login_date).toLocaleString() : "Never"}
            </p>
            <p>Status: {user.disabled ? "Disabled" : "Active"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;