
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
  const { user, loading, userRole } = useAuth();
  const { hasPermission, loadingPermission } = useCheckPermission();
  const { hasAccess, checkingAccess } = useCompanyAccess(requireCompanyAccess);
  const location = useLocation();

  // Show loading state while checking permissions and access
  if (loading || loadingPermission || checkingAccess) {
    return <LoadingSpinner />;
  }

  // Check authentication
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check permission
  if (requirePermission && !hasPermission(requirePermission)) {
    toast.error(`Acesso negado: Você não tem permissão para acessar esta funcionalidade`);
    return <Navigate to="/dashboard" replace />;
  }

  // Check company access
  if (requireCompanyAccess && !hasAccess) {
    toast.error(`Acesso negado: Você não tem acesso a esta empresa`);
    return <Navigate to="/dashboard" replace />;
  }

  // Show role information in console for debugging
  console.log(`User role: ${userRole}, Required permission: ${requirePermission}, Has permission: ${requirePermission ? hasPermission(requirePermission) : 'No permission required'}`);

  // Check role-based access
  return (
    <RoleCheck allowedRoles={allowedRoles}>
      {children}
    </RoleCheck>
  );
}
