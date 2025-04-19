
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { UserTable } from "./users/UserTable";
import { UserHeader } from "./users/UserHeader";

export default function UserManagementSettings() {
  const { users, isLoading, deleteUser } = useUsers();

  const handleAddUser = () => {
    toast.info("Função em desenvolvimento");
  };

  const handleEditUser = (userId: string) => {
    toast.info("Função em desenvolvimento");
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser.mutateAsync(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
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
      </CardContent>
    </Card>
  );
}
