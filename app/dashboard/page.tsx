"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Loading from "@/app/dashboard/loading";
import { fetchUsers, FetchUsersResponse, User } from "@/app/services/users";
import { formatDateInFrenchShort, truncateString } from "@/app/lib/utils";
import { MoreHorizontal, Trash, Power } from "lucide-react";

interface UserRowProps {
  user: User;
  onEdit: (userId: string) => void;
  onDisable: (userId: string) => void;
  onDelete: (userId: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDisable, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);

  const {
    id,
    login,
    email,
    role,
    created_at,
    last_login_date,
    disabled,
    deleted,
  } = user;

  return (
    <TableRow>
      <TableCell>{truncateString(login, 15)}</TableCell>
      <TableCell>{truncateString(email, 15)}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell>{formatDateInFrenchShort(created_at)}</TableCell>
      <TableCell>
        {last_login_date ? formatDateInFrenchShort(last_login_date) : "Jamais"}
      </TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-xs ${
          deleted ? "bg-red-100 text-red-800" :
            disabled ? "bg-yellow-100 text-yellow-800" :
              "bg-green-100 text-green-800"
        }`}>
          {deleted ? "Supprimé" : disabled ? "Désactivé" : "Activé"}
        </span>
      </TableCell>
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="grid gap-2">
              <h4 className="font-medium text-sm mb-2">Actions</h4>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsDisableDialogOpen(true)}
              >
                <Power className="mr-2 h-4 w-4" />
                {disabled ? "Activer" : "Désactiver"}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Dialog de confirmation pour la suppression */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer l'utilisateur {login} ?
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  onDelete(id);
                  setIsDeleteDialogOpen(false);
                }}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog de confirmation pour la désactivation */}
        <AlertDialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Confirmer {disabled ? "l'activation" : "la désactivation"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {disabled
                  ? `Êtes-vous sûr de vouloir activer l'utilisateur ${login} ?`
                  : `Êtes-vous sûr de vouloir désactiver l'utilisateur ${login} ?`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onDisable(id);
                  setIsDisableDialogOpen(false);
                }}
              >
                {disabled ? "Activer" : "Désactiver"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data.users);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleEdit = (userId: string) => {
    console.log("Édition de l'utilisateur:", userId);
  };

  const handleDisable = async (userId: string) => {
    try {
      // Appel API pour désactiver/activer l'utilisateur
      console.log("Désactivation/Activation de l'utilisateur:", userId);
      // Mise à jour de la liste après succès
      // setUsers(users.map(user => 
      //   user.id === userId ? { ...user, disabled: !user.disabled } : user
      // ));
    } catch (error) {
      console.error("Erreur lors de la désactivation/activation:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      // Appel API pour supprimer l'utilisateur
      console.log("Suppression de l'utilisateur:", userId);
      // Mise à jour de la liste après succès
      // setUsers(users.map(user => 
      //   user.id === userId ? { ...user, deleted: true } : user
      // ));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto py-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Login</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Création</TableHead>
            <TableHead>Dernière connexion</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDisable={handleDisable}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}