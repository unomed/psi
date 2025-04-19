
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { User } from "@/hooks/useUsers";

interface UserTableRowProps {
  user: User;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function UserTableRow({ user, onEdit, onDelete }: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>{user.full_name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        {user.role === 'admin' ? 'Administrador' : 
         user.role === 'superadmin' ? 'Super Admin' : 'Avaliador'}
      </TableCell>
      <TableCell>{user.companies.join(", ") || "-"}</TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(user.id)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(user.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
