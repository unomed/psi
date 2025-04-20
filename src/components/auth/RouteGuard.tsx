
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
  const { hasPermission, loadingPermission, permissions } = useCheckPermission();
  const { hasAccess, checkingAccess } = useCompanyAccess(requireCompanyAccess);
  const location = useLocation();

  // Debug logs
  console.log('[RouteGuard] Verificando acesso para rota:', location.pathname);
  console.log('[RouteGuard] Perfil do usuário:', userRole);
  console.log('[RouteGuard] Permissão requerida:', requirePermission);
  console.log('[RouteGuard] Permissões configuradas:', permissions);
  console.log('[RouteGuard] Acesso à empresa requerido:', requireCompanyAccess);
  console.log('[RouteGuard] Empresas do usuário:', userCompanies);
  
  // Show loading while checking permissions and access
  if (loading || loadingPermission || checkingAccess) {
    return <LoadingSpinner />;
  }

  // Check authentication
  if (!user) {
    toast.error('Você precisa estar logado para acessar esta página');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check permission based on permission settings
  if (requirePermission && !hasPermission(requirePermission)) {
    console.error(`[RouteGuard] Permissão negada: ${requirePermission} não está habilitada para o perfil ${userRole}`);
    toast.error(`Acesso negado: Você não tem permissão "${requirePermission}" para acessar esta funcionalidade`);
    return <Navigate to="/dashboard" replace />;
  }

  // For protected routes that require company association
  const routesRequiringCompanyAccess = ['/empresas', '/funcionarios', '/setores', '/funcoes', '/avaliacoes', '/relatorios'];
  const currentPath = location.pathname;
  
  // If the user is not superadmin and tries to access a route that requires company association
  if (routesRequiringCompanyAccess.some(route => currentPath.startsWith(route)) && userRole !== 'superadmin') {
    // Check if the user has at least one company associated
    if (userCompanies.length === 0) {
      console.error('[RouteGuard] Acesso negado: Usuário não tem nenhuma empresa associada');
      toast.error('Acesso negado: Você não tem acesso a nenhuma empresa no sistema');
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Check specific company access if needed
  if (requireCompanyAccess && !hasAccess) {
    console.error(`[RouteGuard] Acesso à empresa negado: ${requireCompanyAccess} não está associada ao usuário`);
    toast.error('Acesso negado: Você não tem acesso à empresa solicitada');
    return <Navigate to="/dashboard" replace />;
  }

  // Log final decision
  console.log(`[RouteGuard] Acesso concedido para rota: ${location.pathname}`);
  
  // Check role-based access
  return (
    <RoleCheck allowedRoles={allowedRoles}>
      {children}
    </RoleCheck>
  );
}
