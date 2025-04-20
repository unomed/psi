
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserTableRow } from "./UserTableRow";
import { User } from "@/hooks/users/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onToggleActive: (user: User) => void;
}

export function UserTable({ users, onEditUser, onDeleteUser, onToggleActive }: UserTableProps) {
  if (!users?.length) {
    return (
      <Alert>
        <AlertDescription>
          Nenhum usuário encontrado.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead>Empresas</TableHead>
          <TableHead>Ativo</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserTableRow
            key={user.id}
            user={user}
            onEdit={onEditUser}
            onDelete={onDeleteUser}
            onToggleActive={onToggleActive}
          />
        ))}
      </TableBody>
    </Table>
  );
}
