
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckPermission } from '@/hooks/useCheckPermission';
import { useCompanyAccess } from '@/hooks/useCompanyAccess';
import { RoleCheck } from './RoleCheck';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'sonner';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requirePermission?: string;
  requireCompanyAccess?: string;
}

export function RouteGuard({ 
  children, 
  allowedRoles, 
  requirePermission, 
  requireCompanyAccess 
}: RouteGuardProps) {
  const { user, loading, userRole, userCompanies } = useAuth();
  const { hasPermission, loadingPermission } = useCheckPermission();
  const { hasAccess, checkingAccess } = useCompanyAccess(requireCompanyAccess);
  const location = useLocation();

  // Log para depuração
  console.log('[RouteGuard] Checking access for route:', location.pathname);
  console.log('[RouteGuard] User role:', userRole);
  console.log('[RouteGuard] Required permission:', requirePermission);
  console.log('[RouteGuard] Required company access:', requireCompanyAccess);
  console.log('[RouteGuard] User companies:', userCompanies);
  
  // Show loading state while checking permissions and access
  if (loading || loadingPermission || checkingAccess) {
    return <LoadingSpinner />;
  }

  // Check authentication
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check permission based on configured permissions
  if (requirePermission && !hasPermission(requirePermission)) {
    toast.error(`Acesso negado: Você não tem permissão "${requirePermission}" para acessar esta funcionalidade`);
    console.error(`[RouteGuard] Permission denied: ${requirePermission}`);
    return <Navigate to="/dashboard" replace />;
  }

  // Check company access - this now strictly uses what's configured in the User Management page
  if (requireCompanyAccess && !hasAccess) {
    toast.error(`Acesso negado: Você não tem acesso à empresa solicitada`);
    console.error(`[RouteGuard] Company access denied: ${requireCompanyAccess}`);
    return <Navigate to="/dashboard" replace />;
  }

  // Log final decision
  console.log(`[RouteGuard] Access granted for route: ${location.pathname}`);
  
  // Check role-based access
  return (
    <RoleCheck allowedRoles={allowedRoles}>
      {children}
    </RoleCheck>
  );
}
