'use client';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useEffect, useState } from 'react';
import { fetchUsers, User } from '@/app/services/users';
import { UserRow } from '@/components/dashboard/UserRow';
import Loading from "@/app/dashboard/loading";
import RenderUserDashboard from "@/app/ui/dashboard/RenderUserDashboard";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  if (loading) return <Loading />;
  return <RenderUserDashboard />
}
