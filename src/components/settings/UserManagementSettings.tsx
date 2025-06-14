import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useUsers } from "@/hooks/users/useUsers";
import { UserFormDialog } from "./users/UserFormDialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";
import { toast } from "sonner";

export default function UserManagementSettings() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const { users, isLoading, refetch } = useUsers();
  const { deleteUser } = useDeleteUser();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDeleteUser = async () => {
    if (deletingUser) {
      try {
        await deleteUser(deletingUser.id);
        toast.success("Usuário deletado com sucesso!");
        setDeletingUser(null);
        refetch(); // Refresh the user list
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        toast.error("Erro ao deletar usuário");
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'full_name', headerName: 'Nome Completo', width: 200 },
    {
      field: 'role',
      headerName: 'Função',
      width: 120,
      valueGetter: (params) => params.row.role,
    },
    {
      field: 'company',
      headerName: 'Empresa',
      width: 150,
      valueGetter: (params) => params.row.company?.name || 'Nenhuma',
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex gap-2">
          <Button size="icon" onClick={() => {
            setEditingUser(params.row);
            setIsEditDialogOpen(true);
          }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá deletar o usuário permanentemente. Tem certeza que deseja continuar?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser}>Deletar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gerenciar Usuários</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Usuário
        </Button>
      </div>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.id}
        />
      </div>

      {/* Dialogs - using isOpen instead of open */}
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
