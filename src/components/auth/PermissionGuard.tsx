
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissionGuard } from '@/hooks/permissions/usePermissionGuard';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'sonner';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: 'manage_permissions' | 'manage_users' | 'view_companies' | 'view_billing' | 'view_settings';
  fallbackPath?: string;
}

export function PermissionGuard({ 
  children, 
  requiredPermission, 
  fallbackPath = '/dashboard' 
}: PermissionGuardProps) {
  const { userRole, loading } = useAuth();
  const { 
    canAccessPermissionsPage, 
    canAccessUsersPage, 
    canAccessCompaniesPage, 
    canAccessBillingPage,
    canAccessSettingsPage 
  } = usePermissionGuard();
  const location = useLocation();

  console.log('[PermissionGuard] Verificando permissão:', {
    requiredPermission,
    userRole,
    currentPath: location.pathname
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  let hasAccess = false;
  let permissionName = '';

  switch (requiredPermission) {
    case 'manage_permissions':
      hasAccess = canAccessPermissionsPage();
      permissionName = 'gerenciar permissões';
      break;
    case 'manage_users':
      hasAccess = canAccessUsersPage();
      permissionName = 'gerenciar usuários';
      break;
    case 'view_companies':
      hasAccess = canAccessCompaniesPage();
      permissionName = 'visualizar empresas';
      break;
    case 'view_billing':
      hasAccess = canAccessBillingPage();
      permissionName = 'visualizar faturamento';
      break;
    case 'view_settings':
      hasAccess = canAccessSettingsPage();
      permissionName = 'acessar configurações';
      break;
    default:
      hasAccess = false;
  }

  if (!hasAccess) {
    console.log('[PermissionGuard] Acesso negado:', {
      requiredPermission,
      userRole,
      permissionName
    });
    
    toast.error(`Acesso negado: Você não tem permissão para ${permissionName}`);
    return <Navigate to={fallbackPath} replace />;
  }

  console.log('[PermissionGuard] Acesso concedido para:', permissionName);
  return <>{children}</>;
}
