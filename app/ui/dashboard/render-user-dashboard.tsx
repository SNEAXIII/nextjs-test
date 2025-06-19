import React from 'react';
import { User } from '@/app/services/users';
import { Table, TableBody } from '@/components/ui/table';
import { UserRow } from '@/components/dashboard/UserRow';
import TableHeaderUsers from '@/app/ui/dashboard/table-header';

interface RenderUserDashboardProps {
  users: User[];
  onDisable: (userId: string) => void;
  onEnable: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export default function RenderUserDashboard({
  users,
  onDisable,
  onEnable,
  onDelete,
}: RenderUserDashboardProps) {
  return (
    <div className='container mx-auto py-6'>
      <Table>
        <TableHeaderUsers />
        <TableBody>{}
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onDisable={onDisable}
              onEnable={onEnable}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
