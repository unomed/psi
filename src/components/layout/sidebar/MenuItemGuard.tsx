
import { useRoutePermissions } from '@/hooks/permissions/useRoutePermissions';
import { useCompanyBasedPermissions } from '@/hooks/permissions/useCompanyBasedPermissions';

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
  const { isMenuAllowed, userRole } = useCompanyBasedPermissions();

  console.log('[MenuItemGuard] Checking access:', {
    userRole,
    routeKey,
    requiredPermission,
    allowedRoles
  });

  // Determinar chave do menu baseado na rota ou permissão
  let menuKey: string = routeKey || 'unknown';
  if (!routeKey && requiredPermission) {
    const permissionResource = requiredPermission.split(':')[0];
    if (permissionResource === 'companies') menuKey = 'empresas';
    if (permissionResource === 'billing') menuKey = 'faturamento';
    if (permissionResource === 'manage_users') menuKey = 'usuarios';
    if (permissionResource === 'manage_permissions') menuKey = 'permissoes';
  }

  // Verificar se o menu é permitido baseado na empresa selecionada
  const isAllowed = isMenuAllowed(menuKey, requiredPermission, allowedRoles);
  
  if (!isAllowed) {
    console.log('[MenuItemGuard] Access denied for menu:', menuKey);
    return null;
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
