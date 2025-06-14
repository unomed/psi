
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
    console.log('[RouteGuard] Usuário não autenticado, redirecionando para login');
    toast.error('Você precisa estar logado para acessar esta página');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Special handling for dashboard - always allow if user is authenticated
  if (location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard')) {
    console.log('[RouteGuard] Rota de dashboard, permitindo acesso');
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

  // For routes that require company access
  if (requireCompanyAccess) {
    // Superadmin always has access
    if (userRole === 'superadmin') {
      console.log('[RouteGuard] Usuário é superadmin, concedendo acesso à rota com requireCompanyAccess');
    } else {
      // For other roles, check if they have at least one company
      if (!userCompanies || userCompanies.length === 0) {
        console.error('[RouteGuard] Acesso negado: Usuário não tem nenhuma empresa associada');
        toast.error('Acesso negado: Você não tem acesso a nenhuma empresa no sistema');
        return <Navigate to="/dashboard" replace />;
      }
      
      // Additional check using the useCompanyAccess hook
      if (!hasAccess) {
        console.error(`[RouteGuard] Acesso negado pela verificação de empresa`);
        toast.error('Acesso negado: Você não tem acesso necessário para esta funcionalidade');
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  // For company-related routes that don't have explicit requireCompanyAccess but need company access
  const routesRequiringCompanyAccess = ['/empresas', '/funcionarios', '/setores', '/funcoes', '/avaliacoes', '/relatorios', '/gestao-riscos', '/plano-acao'];
  const currentPath = location.pathname;
  
  if (routesRequiringCompanyAccess.some(route => currentPath.startsWith(route)) && !requireCompanyAccess && userRole !== 'superadmin') {
    // Check if user has at least one associated company
    if (!userCompanies || userCompanies.length === 0) {
      console.error('[RouteGuard] Acesso negado: Usuário não tem nenhuma empresa associada para rota que requer empresa');
      toast.error('Acesso negado: Você não tem acesso a nenhuma empresa no sistema');
      return <Navigate to="/dashboard" replace />;
    }
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
