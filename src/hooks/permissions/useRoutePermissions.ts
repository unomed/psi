
import { usePermissionValidation } from './usePermissionValidation';

export function useRoutePermissions() {
  const { validatePermission, validateRole } = usePermissionValidation();

  const canAccessRoute = (routeConfig: {
    requiredPermission?: string;
    allowedRoles?: string[];
  }): boolean => {
    const { requiredPermission, allowedRoles } = routeConfig;

    // Se tem permissão específica requerida, validar
    if (requiredPermission && !validatePermission(requiredPermission)) {
      return false;
    }

    // Se tem papéis específicos permitidos, validar
    if (allowedRoles && !validateRole(allowedRoles)) {
      return false;
    }

    return true;
  };

  const getRouteAccessConfig = () => ({
    permissions: {
      requiredPermission: 'manage_permissions',
      allowedRoles: ['superadmin']
    },
    users: {
      requiredPermission: 'manage_users',
      allowedRoles: ['superadmin', 'admin']
    },
    companies: {
      requiredPermission: 'view_companies',
      allowedRoles: ['superadmin', 'admin']
    },
    billing: {
      requiredPermission: 'view_billing',
      allowedRoles: ['superadmin']
    },
    settings: {
      requiredPermission: 'view_settings',
      allowedRoles: ['superadmin', 'admin']
    }
  });

  return {
    canAccessRoute,
    getRouteAccessConfig
  };
}
