
import { useAuth } from '@/contexts/AuthContext';
import { useCheckPermission } from '@/hooks/useCheckPermission';

export function usePermissionValidation() {
  const { userRole } = useAuth();
  const { hasPermission } = useCheckPermission();

  const validatePermission = (permission: string): boolean => {
    // Superadmin sempre tem acesso
    if (userRole === 'superadmin') return true;
    
    // Verificar permissão específica
    return hasPermission(permission);
  };

  const validateRole = (allowedRoles: string[]): boolean => {
    // Superadmin sempre tem acesso
    if (userRole === 'superadmin') return true;
    
    // Verificar se o papel está na lista permitida
    return userRole ? allowedRoles.includes(userRole) : false;
  };

  const validateMultiplePermissions = (permissions: string[], requireAll = false): boolean => {
    if (userRole === 'superadmin') return true;
    
    if (requireAll) {
      return permissions.every(permission => hasPermission(permission));
    } else {
      return permissions.some(permission => hasPermission(permission));
    }
  };

  return {
    validatePermission,
    validateRole,
    validateMultiplePermissions,
    userRole,
    hasPermission
  };
}
