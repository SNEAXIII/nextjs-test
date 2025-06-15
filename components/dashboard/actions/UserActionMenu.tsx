import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Pencil, Power, Trash } from 'lucide-react';

interface UserActionMenuProps {
  isDeleted: boolean;
  onEdit: () => void;
  onDisable: () => void;
  onDelete: () => void;
}

export function UserActionMenu({ isDeleted, onEdit, onDisable, onDelete }: UserActionMenuProps) {
  if (isDeleted) return null;

  return (
    <DropdownMenuContent align='end'>
      <DropdownMenuItem onClick={onEdit}>
        <Pencil className='mr-2 h-4 w-4' />
        Modifier
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onDisable}>
        <Power className='mr-2 h-4 w-4' />
        Désactiver
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={onDelete}
        className='text-red-600'
      >
        <Trash className='mr-2 h-4 w-4' />
        Supprimer
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
