'use client';

import { TableCell } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Power, Trash } from 'lucide-react';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfirmationDialog } from '@/components/dashboard/dialogs/ConfirmationDialog';

interface UserActionsProps {
  userId: string;
  isDisabled: boolean;
  isDeleted: boolean;
  onDisable: (userId: string) => void;
  onEnable: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function UserActions({
  userId,
  isDisabled,
  isDeleted,
  onDisable,
  onEnable,
  onDelete,
}: UserActionsProps) {
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isDeleted) {
    return (
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant='ghost'
                className='h-8 w-8 p-0'
                disabled={isDeleted}
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cet utilisateur est supprimé</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='h-8 w-8 p-0'
            disabled={isDeleted}
          >
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        {/*TODO REFACTOR HERE*/}
        {!isDeleted && (
          <DropdownMenuContent align='end'>
            {isDisabled ? (
              <DropdownMenuItem
                className='text-green-600'
                onClick={() => setIsDisableDialogOpen(true)}
              >
                <Power className='mr-2 h-4 w-4' />
                Activer
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className='text-red-600'
                onClick={() => setIsDisableDialogOpen(true)}
              >
                <Power className='mr-2 h-4 w-4' />
                Désactiver
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className='text-red-600'
            >
              <Trash className='mr-2 h-4 w-4' />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
      {/*TODO REFACTOR HERE*/}
      {isDisabled ? (
        <ConfirmationDialog
          open={isDisableDialogOpen}
          onOpenChange={setIsDisableDialogOpen}
          title="Activer l'utilisateur"
          description='Êtes-vous sûr de vouloir réactiver cet utilisateur ?'
          onConfirm={() => {
            onEnable(userId);
            setIsDisableDialogOpen(false);
          }}
        />
      ) : (
        <ConfirmationDialog
          open={isDisableDialogOpen}
          onOpenChange={setIsDisableDialogOpen}
          title="Désactiver l'utilisateur"
          description='Êtes-vous sûr de vouloir désactiver cet utilisateur ?'
          onConfirm={() => {
            onDisable(userId);
            setIsDisableDialogOpen(false);
          }}
        />
      )}

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer l'utilisateur"
        description='Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.'
        onConfirm={() => {
          onDelete(userId);
          setIsDeleteDialogOpen(false);
        }}
        variant='destructive'
        confirmText='Supprimer'
      />
    </TableCell>
  );
}
