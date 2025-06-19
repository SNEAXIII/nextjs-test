import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function TableHeaderUsers() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Login</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Rôle</TableHead>
        <TableHead>Création</TableHead>
        <TableHead>Dernière connexion</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead className='w-[50px]'></TableHead>
      </TableRow>
    </TableHeader>
  );
}
