
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

  console.log('[RouteGuard] Estado atual:', {
    rota: location.pathname,
    hasUser: !!user,
    userRole,
    loading,
    loadingPermission,
    checkingAccess,
    isEmployeeRoute: location.pathname.startsWith('/employee-') || location.pathname.startsWith('/auth/employee')
  });

  // Se estiver carregando, mostrar loading
  const isLoading = loading || loadingPermission || checkingAccess;
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Verificar se é uma rota de funcionário - permitir acesso direto
  const isEmployeeRoute = location.pathname.startsWith('/employee-') || 
                         location.pathname.startsWith('/auth/employee') ||
                         location.pathname.startsWith('/avaliacao/') ||
                         location.pathname.startsWith('/assessment/');

  if (isEmployeeRoute) {
    console.log('[RouteGuard] Rota de funcionário detectada, permitindo acesso direto');
    return <>{children}</>;
  }

  // Verificar autenticação para rotas administrativas
  if (!user) {
    // Se já estamos numa rota de auth, permitir acesso
    if (location.pathname.startsWith('/auth')) {
      return <>{children}</>;
    }
    
    console.log('[RouteGuard] Usuário não autenticado, redirecionando para login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Se usuário autenticado está tentando acessar rota de auth
  if (user && location.pathname.startsWith('/auth') && !location.pathname.startsWith('/auth/employee')) {
    console.log('[RouteGuard] Usuário já autenticado, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Verificar permissão específica
  if (requirePermission) {
    const hasRequiredPermission = hasPermission(requirePermission);
    if (!hasRequiredPermission) {
      console.log(`[RouteGuard] Permissão negada: ${requirePermission}`);
      toast.error(`Acesso negado: Você não tem permissão para acessar esta funcionalidade`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Verificar acesso à empresa
  if (requireCompanyAccess === "any") {
    if (userRole !== 'superadmin') {
      if (!userCompanies || userCompanies.length === 0) {
        console.log('[RouteGuard] Usuário não tem empresas associadas');
        toast.error('Acesso negado: Você não tem acesso a nenhuma empresa no sistema');
        return <Navigate to="/dashboard" replace />;
      }
      
      if (!hasAccess) {
        console.log('[RouteGuard] Acesso à empresa negado');
        toast.error('Acesso negado: Você não tem acesso necessário para esta funcionalidade');
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  console.log(`[RouteGuard] Acesso concedido para rota: ${location.pathname}`);
  
  return (
    <RoleCheck allowedRoles={allowedRoles}>
      {children}
    </RoleCheck>
  );
}
