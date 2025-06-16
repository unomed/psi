
import { useRoutePermissions } from '@/hooks/permissions/useRoutePermissions';

interface MenuItemGuardProps {
  children: React.ReactNode;
  routeKey?: 'permissions' | 'users' | 'companies' | 'billing' | 'settings';
  requiredPermission?: string;
  allowedRoles?: string[];
}

export function MenuItemGuard({ 
  children, 
  routeKey,
  requiredPermission,
  allowedRoles 
}: MenuItemGuardProps) {
  const { canAccessRoute, getRouteAccessConfig } = useRoutePermissions();

  let routeConfig;
  
  if (routeKey) {
    routeConfig = getRouteAccessConfig()[routeKey];
  } else {
    routeConfig = {
      requiredPermission,
      allowedRoles
    };
  }

  const hasAccess = canAccessRoute(routeConfig);

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
