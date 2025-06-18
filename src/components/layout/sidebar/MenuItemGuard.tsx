
import { useRoutePermissions } from '@/hooks/permissions/useRoutePermissions';
import { useAuth } from '@/contexts/AuthContext';

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
  const { userRole } = useAuth();

  console.log('[MenuItemGuard] Checking access:', {
    userRole,
    routeKey,
    requiredPermission,
    allowedRoles
  });

  // Superadmin sempre tem acesso a tudo
  if (userRole === 'superadmin') {
    console.log('[MenuItemGuard] Superadmin access granted');
    return <>{children}</>;
  }

  let routeConfig;
  
  if (routeKey) {
    routeConfig = getRouteAccessConfig()[routeKey];
  } else {
    routeConfig = {
      requiredPermission,
      allowedRoles
    };
  }

  // Se não há configuração de rota, usar allowedRoles fornecidos
  if (!routeConfig.allowedRoles && !routeConfig.requiredPermission) {
    if (allowedRoles && userRole) {
      const hasAccess = allowedRoles.includes(userRole);
      console.log('[MenuItemGuard] Direct role check:', { hasAccess, userRole, allowedRoles });
      return hasAccess ? <>{children}</> : null;
    }
  }

  const hasAccess = canAccessRoute(routeConfig);

  console.log('[MenuItemGuard] Access result:', {
    hasAccess,
    routeConfig
  });

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
