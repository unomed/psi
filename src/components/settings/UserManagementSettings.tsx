
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useFetchUsers } from "@/hooks/users/useFetchUsers";
import { UserFormDialog } from "./users/UserFormDialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { User } from "@/hooks/users/types";

export default function UserManagementSettings() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const { data: users, isLoading, error } = useFetchUsers();
  const deleteUserMutation = useDeleteUser();

  const handleDeleteUser = async () => {
    if (deletingUser) {
      try {
        await deleteUserMutation.mutateAsync(deletingUser.id);
        toast.success("Usuário desativado com sucesso!");
        setDeletingUser(null);
      } catch (error) {
        console.error("Erro ao desativar usuário:", error);
        toast.error("Erro ao desativar usuário");
      }
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'full_name',
      header: 'Nome Completo',
    },
    {
      accessorKey: 'role',
      header: 'Função',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        const roleLabels = {
          'admin': 'Administrador',
          'superadmin': 'Super Admin',
          'evaluator': 'Avaliador',
          'profissionais': 'Profissionais'
        };
        return roleLabels[role as keyof typeof roleLabels] || role;
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active') as boolean;
        return (
          <span className={`px-2 py-1 rounded text-xs ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Ativo' : 'Inativo'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => {
            setEditingUser(row.original);
            setIsEditDialogOpen(true);
          }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setDeletingUser(row.original)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá desativar o usuário. Tem certeza que deseja continuar?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser}>Desativar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  if (error) {
    console.error("Erro ao carregar usuários:", error);
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Gerenciar Usuários</h2>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Usuário
          </Button>
        </div>
        <div className="text-center text-red-500 p-4">
          Erro ao carregar usuários. Tente recarregar a página.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gerenciar Usuários</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Usuário
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users || []}
        isLoading={isLoading}
      />

      {/* Dialogs */}
      <UserFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        mode="create"
      />

      {editingUser && (
        <UserFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingUser(null);
          }}
          user={editingUser}
          mode="edit"
        />
      )}
    </div>
  );
}
