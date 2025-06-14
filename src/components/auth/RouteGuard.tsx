
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

  // Debug logs
  console.log('[RouteGuard] Verificando acesso para rota:', location.pathname);
  console.log('[RouteGuard] Perfil do usuário:', userRole);
  console.log('[RouteGuard] Permissão requerida:', requirePermission);
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

  // Special handling for dashboard - always allow if user is authenticated
  if (location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard')) {
    return (
      <RoleCheck allowedRoles={allowedRoles}>
        {children}
      </RoleCheck>
    );
  }

  // Check permission based on permission settings (only if not dashboard)
  if (requirePermission && !hasPermission(requirePermission)) {
    console.error(`[RouteGuard] Permissão negada: ${requirePermission} não está habilitada para o perfil ${userRole}`);
    toast.error(`Acesso negado: Você não tem permissão "${requirePermission}" para acessar esta funcionalidade`);
    return <Navigate to="/dashboard" replace />;
  }

  // For routes that require company association
  const routesRequiringCompanyAccess = ['/empresas', '/funcionarios', '/setores', '/funcoes', '/avaliacoes', '/relatorios', '/gestao-riscos', '/plano-acao'];
  const currentPath = location.pathname;
  
  // Check if user has access to route based on companies (except for superadmin who has access to all)
  if (routesRequiringCompanyAccess.some(route => currentPath.startsWith(route)) && userRole !== 'superadmin') {
    // Check if user has at least one associated company
    if (!userCompanies || userCompanies.length === 0) {
      console.error('[RouteGuard] Acesso negado: Usuário não tem nenhuma empresa associada');
      toast.error('Acesso negado: Você não tem acesso a nenhuma empresa no sistema');
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // For company-related routes, filter access more rigorously
  if (currentPath.startsWith('/empresas') && userRole !== 'superadmin') {
    console.log('[RouteGuard] Verificando acesso específico para rota de empresas');
    // If not superadmin and has no companies, redirect
    if (!userCompanies || userCompanies.length === 0) {
      console.error('[RouteGuard] Usuário não tem acesso a nenhuma empresa');
      toast.error('Você não tem acesso a nenhuma empresa no sistema');
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Check specific company access if necessary
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
