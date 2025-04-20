
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
  
  // Mostrar carregamento enquanto verifica permissões e acesso
  if (loading || loadingPermission || checkingAccess) {
    return <LoadingSpinner />;
  }

  // Verificar autenticação
  if (!user) {
    toast.error('Você precisa estar logado para acessar esta página');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Verificar permissão com base nas configurações de permissão
  if (requirePermission && !hasPermission(requirePermission)) {
    console.error(`[RouteGuard] Permissão negada: ${requirePermission} não está habilitada para o perfil ${userRole}`);
    toast.error(`Acesso negado: Você não tem permissão "${requirePermission}" para acessar esta funcionalidade`);
    return <Navigate to="/dashboard" replace />;
  }

  // Para rotas protegidas que requerem associação de empresa
  const routesRequiringCompanyAccess = ['/empresas', '/funcionarios', '/setores', '/funcoes', '/avaliacoes', '/relatorios'];
  const currentPath = location.pathname;
  
  // Verificar se o usuário tem acesso à rota baseado em empresas (exceto para superadmin que tem acesso a todas)
  if (routesRequiringCompanyAccess.some(route => currentPath.startsWith(route)) && userRole !== 'superadmin') {
    // Verificar se o usuário tem pelo menos uma empresa associada
    if (userCompanies.length === 0) {
      console.error('[RouteGuard] Acesso negado: Usuário não tem nenhuma empresa associada');
      toast.error('Acesso negado: Você não tem acesso a nenhuma empresa no sistema');
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // Para rotas relacionadas às empresas, filtrar acesso ainda mais rigorosamente
  if (currentPath.startsWith('/empresas') && userRole !== 'superadmin') {
    console.log('[RouteGuard] Verificando acesso específico para rota de empresas');
    // Se não for superadmin e não tiver empresas, redirecionar
    if (userCompanies.length === 0) {
      console.error('[RouteGuard] Usuário não tem acesso a nenhuma empresa');
      toast.error('Você não tem acesso a nenhuma empresa no sistema');
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Verificar acesso específico à empresa, se necessário
  if (requireCompanyAccess && !hasAccess) {
    console.error(`[RouteGuard] Acesso à empresa negado: ${requireCompanyAccess} não está associada ao usuário`);
    toast.error('Acesso negado: Você não tem acesso à empresa solicitada');
    return <Navigate to="/dashboard" replace />;
  }

  // Registrar decisão final
  console.log(`[RouteGuard] Acesso concedido para rota: ${location.pathname}`);
  
  // Verificar acesso baseado em papel
  return (
    <RoleCheck allowedRoles={allowedRoles}>
      {children}
    </RoleCheck>
  );
}
