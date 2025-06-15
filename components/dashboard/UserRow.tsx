import { TableRow } from '@/components/ui/table';
import { User } from '@/app/services/users';
import {
  RowUserCreatedAt,
  RowUserEmail,
  RowUserLastLoginDate,
  RowUserLogin,
  RowUserRole,
  UserStatusBadge,
} from '@/components/dashboard/UserDashboard';
import { UserActions } from '@/components/dashboard/actions/UserActions';

interface UserRowProps {
  user: User;
  onDisable: (userId: string) => void;
  onEnable: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function UserRow({ user, onDisable, onEnable, onDelete }: UserRowProps) {
  return (
    <TableRow>
      <RowUserLogin login={user.login} />
      <RowUserEmail email={user.email} />
      <RowUserRole role={user.role} />
      <RowUserCreatedAt created_at={user.created_at} />
      <RowUserLastLoginDate lastLoginDate={user.last_login_date} />
      <UserStatusBadge
        deleted={user.deleted}
        disabled={user.disabled}
      />
      <UserActions
        userId={user.id}
        isDisabled={user.disabled}
        isDeleted={user.deleted}
        onDisable={onDisable}
        onEnable={onEnable}
        onDelete={onDelete}
      />
    </TableRow>
  );
}
