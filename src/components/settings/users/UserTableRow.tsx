import { useState } from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface UserTableRowProps {
  user: User;
  isLoading?: boolean;
}

export function UserTableRow({ user, isLoading }: UserTableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteUser } = useMutation({
    mutationFn: async (id: string) => {
      setIsDeleting(true);
      return api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      toast.success("Usuário excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir usuário: ${error.message}`);
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  if (isLoading) {
    return (
      <tr>
        <td>
          <Skeleton className="h-4 w-[150px]" />
        </td>
        <td>
          <Skeleton className="h-4 w-[100px]" />
        </td>
        <td>
          <Skeleton className="h-4 w-[100px]" />
        </td>
        <td>
          <Skeleton className="h-4 w-[50px]" />
        </td>
        <td>
          <Skeleton className="h-4 w-[50px]" />
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <Badge variant={user.status === 'active' ? "default" : "destructive"}>
          {user.status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      </td>
      <td>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => deleteUser(user.id)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
