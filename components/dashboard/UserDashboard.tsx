import { User } from '@/app/services/users';
import { TableCell } from '@/components/ui/table';
import { formatDateInFrenchShort, truncateString } from '@/app/lib/utils';
import React from 'react';

export interface UserRowProps {
  user: User;
  onEdit: (userId: string) => void;
  onDisable: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function UserStatusBadge(props: { deleted: boolean; disabled: boolean }) {
  const getStatusStyle = () => {
    if (props.deleted) return 'bg-red-100 text-red-800';
    if (props.disabled) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = () => {
    if (props.deleted) return 'Supprimé';
    if (props.disabled) return 'Désactivé';
    return 'Activé';
  };

  return (
    <TableCell>
      <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle()}`}>
        {getStatusText()}
      </span>
    </TableCell>
  );
}

export function RowUserLogin(props: { login: string }) {
  return <TableCell>{truncateString(props.login, 15)}</TableCell>;
}

export function RowUserEmail(props: { email: string }) {
  return <TableCell>{truncateString(props.email, 50)}</TableCell>;
}

export function RowUserRole(props: { role: string }) {
  return <TableCell>{props.role}</TableCell>;
}

export function RowUserCreatedAt(props: { created_at: string }) {
  return <TableCell>{formatDateInFrenchShort(props.created_at)}</TableCell>;
}

export function RowUserLastLoginDate(props: { lastLoginDate: string | null }) {
  return (
    <TableCell>
      {props.lastLoginDate ? formatDateInFrenchShort(props.lastLoginDate) : 'Jamais'}
    </TableCell>
  );
}
