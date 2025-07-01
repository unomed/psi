
import { useState } from "react";
import { toast } from "sonner";
import { Permission, usePermissions } from "@/hooks/usePermissions";
import { createFullPermissions } from "@/utils/permissionUtils";

export function usePermissionOperations() {
  const { updatePermission, createRole, deleteRole } = usePermissions();
  const [newRoleName, setNewRoleName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Permission | null>(null);

  const handleTogglePermission = (role: Permission, permissionId: string) => {
    if (role.role === 'superadmin') {
      return;
    }
    
    const newPermissions = { 
      ...role.permissions,
      [permissionId]: !role.permissions[permissionId]
    };
    
    updatePermission.mutate({ 
      roleId: role.id, 
      permissions: newPermissions 
    });
  };
  
  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast.error("O nome do perfil é obrigatório");
      return;
    }
    
    const basicPermissions = createFullPermissions(false);
    basicPermissions.view_dashboard = true;
    
    createRole.mutate({ 
      role: newRoleName.trim(), 
      permissions: basicPermissions 
    });
    
    setNewRoleName("");
    setDialogOpen(false);
  };

  const handleEditRole = () => {
    if (!selectedRole || !newRoleName.trim()) {
      toast.error("O nome do perfil é obrigatório");
      return;
    }

    updatePermission.mutate({
      roleId: selectedRole.id,
      permissions: selectedRole.permissions,
      role: newRoleName.trim()
    } as any);

    setNewRoleName("");
    setEditDialogOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;
    
    deleteRole.mutate(selectedRole.id, {
      onSuccess: () => {
        toast.success("Perfil excluído com sucesso");
        setDeleteDialogOpen(false);
        setSelectedRole(null);
      }
    });
  };

  const onEditRole = (role: Permission) => {
    setSelectedRole(role);
    setNewRoleName(role.role);
    setEditDialogOpen(true);
  };

  const onDeleteRole = (role: Permission) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const getPermissionValue = (role: Permission, permissionId: string): boolean => {
    return !!role.permissions[permissionId];
  };

  return {
    newRoleName,
    setNewRoleName,
    dialogOpen,
    setDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedRole,
    setSelectedRole,
    handleTogglePermission,
    handleCreateRole,
    handleEditRole,
    handleDeleteRole,
    onEditRole,
    onDeleteRole,
    getPermissionValue
  };
}
