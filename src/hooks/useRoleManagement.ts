
import { useState, useEffect } from "react";
import { useRoles } from "@/hooks/useRoles";
import { useAuth } from "@/contexts/AuthContext";
import { RoleData } from "@/components/roles/RoleCard";
import { toast } from "sonner";

export function useRoleManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [viewingRole, setViewingRole] = useState<RoleData | null>(null);
  const [canCreateRoles, setCanCreateRoles] = useState(false);
  const { roles, isLoading, createRole, updateRole, deleteRole } = useRoles();
  const { userRole } = useAuth();

  useEffect(() => {
    const checkPermissions = async () => {
      const isSuperAdminOrAdmin = userRole === 'superadmin' || userRole === 'admin';
      setCanCreateRoles(isSuperAdminOrAdmin);
    };
    
    checkPermissions();
  }, [userRole]);

  const handleCreateOrUpdateRole = async (values: any) => {
    try {
      if (!canCreateRoles) {
        toast.error("Você não tem permissão para gerenciar funções");
        return;
      }

      if (editingRole) {
        await updateRole.mutateAsync({
          ...editingRole,
          ...values,
          sectorId: values.sectorId || null,
        });
      } else {
        await createRole.mutateAsync({
          ...values,
          sectorId: values.sectorId || null,
        });
      }

      setIsDialogOpen(false);
      setEditingRole(null);
    } catch (error) {
      console.error("Error managing role:", error);
    }
  };

  const handleDeleteRole = async (role: RoleData) => {
    if (confirm("Tem certeza que deseja excluir esta função?")) {
      try {
        await deleteRole.mutateAsync(role.id);
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingRole,
    setEditingRole,
    viewingRole,
    setViewingRole,
    canCreateRoles,
    roles,
    isLoading,
    handleCreateOrUpdateRole,
    handleDeleteRole,
  };
}
