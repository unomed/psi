
import { usePermissionInitialization } from "./permissions/usePermissionInitialization";
import { usePermissionMutations } from "./permissions/usePermissionMutations";

export interface Permission {
  id: string;
  role: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export function usePermissions() {
  const { data: permissions, isLoading } = usePermissionInitialization();
  const { updatePermission, createRole, deleteRole } = usePermissionMutations();

  return {
    permissions,
    isLoading,
    updatePermission,
    createRole,
    deleteRole
  };
}
