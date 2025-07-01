
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionService } from '@/services/permissions/permissionService';
import { getAllPermissions, getDefaultPermissionsForRole } from '@/utils/permissions/defaultPermissions';

export function usePermissionCheck() {
  const { userRole } = useAuth();
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [permissions, setPermissions] = useState<Record<string, boolean> | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchPermissions = async () => {
      if (!userRole) {
        console.log("[usePermissionCheck] No user role found, setting default permissions");
        if (isMounted) {
          setLoadingPermission(false);
          setPermissions({});
        }
        return;
      }

      // Superadmin sempre tem todas as permissões
      if (userRole === 'superadmin') {
        console.log("[usePermissionCheck] User is superadmin, granting all permissions");
        if (isMounted) {
          const allPermissions = getAllPermissions();
          setPermissions(allPermissions);
          setLoadingPermission(false);
        }
        return;
      }

      const fetchedPermissions = await PermissionService.fetchUserPermissions(userRole);
      
      if (!isMounted) return;

      if (fetchedPermissions) {
        setPermissions(fetchedPermissions);
      } else {
        console.log("[usePermissionCheck] Using default permissions for role:", userRole);
        const defaultPermissions = getDefaultPermissionsForRole(userRole);
        setPermissions(defaultPermissions);
      }

      setLoadingPermission(false);
    };

    fetchPermissions();
    
    return () => {
      isMounted = false;
    };
  }, [userRole]);

  const hasPermission = useCallback((permissionKey: string): boolean => {
    if (userRole === 'superadmin') return true;
    
    if (loadingPermission) return false;
    
    console.log(`[usePermissionCheck] Checking permission ${permissionKey} for role ${userRole}:`, 
      permissions ? permissions[permissionKey] : "no permissions data");
    
    if (permissions && permissions[permissionKey] === true) {
      return true;
    }
    
    return false;
  }, [userRole, loadingPermission, permissions]);

  return {
    hasPermission,
    loadingPermission,
    permissions
  };
}
