import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsers, User } from "@/hooks/users/useUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { UserTable } from "./users/UserTable";
import { UserHeader } from "./users/UserHeader";
import { UserFormDialog } from "./users/UserFormDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UserManagementSettings() {
  const { users, isLoading, deleteUser, updateUserRole, createUser } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleAddUser = () => {
    setIsAddOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser.mutateAsync(selectedUser.id);
        setIsDeleteOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleCreateUser = async (data: any) => {
    try {
      await createUser.mutateAsync({
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        companyIds: data.companyIds,
      });
      setIsAddOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const handleUpdateUser = async (data: any) => {
    if (selectedUser) {
      try {
        await updateUserRole.mutateAsync({
          userId: selectedUser.id,
          role: data.role,
          companyIds: data.companyIds,
        });
        setIsEditOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Erro ao atualizar função do usuário');
        throw error;
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Usuários</CardTitle>
        <CardDescription>
          Gerencie usuários e suas permissões no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserHeader onAddUser={handleAddUser} />
        <UserTable 
          users={users || []} 
          onEditUser={handleEditUser} 
          onDeleteUser={handleDeleteUser}
        />

        <UserFormDialog
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleCreateUser}
          title="Adicionar Usuário"
        />

        {selectedUser && (
          <UserFormDialog
            open={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={handleUpdateUser}
            user={selectedUser}
            title="Editar Usuário"
          />
        )}

        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
