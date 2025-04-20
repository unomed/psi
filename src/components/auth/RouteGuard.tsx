
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

  // Log para depuração
  console.log('[RouteGuard] Verificando acesso para rota:', location.pathname);
  console.log('[RouteGuard] Perfil do usuário:', userRole);
  console.log('[RouteGuard] Permissão requerida:', requirePermission);
  console.log('[RouteGuard] Permissões configuradas:', permissions);
  console.log('[RouteGuard] Acesso à empresa requerido:', requireCompanyAccess);
  console.log('[RouteGuard] Empresas do usuário:', userCompanies);
  
  // Mostrar loading enquanto verifica permissões e acesso
  if (loading || loadingPermission || checkingAccess) {
    return <LoadingSpinner />;
  }

  // Verificar autenticação
  if (!user) {
    toast.error('Você precisa estar logado para acessar esta página');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Verificar permissão baseada nas configurações da página de permissões
  if (requirePermission && !hasPermission(requirePermission)) {
    console.error(`[RouteGuard] Permissão negada: ${requirePermission} não está habilitada para o perfil ${userRole}`);
    toast.error(`Acesso negado: Você não tem permissão "${requirePermission}" para acessar esta funcionalidade`);
    return <Navigate to="/dashboard" replace />;
  }

  // Para rotas protegidas que requerem associação com empresa
  const routesRequiringCompanyAccess = ['/empresas', '/funcionarios', '/setores', '/funcoes', '/avaliacoes', '/relatorios'];
  const currentPath = location.pathname;
  
  // Se o usuário não for superadmin e tenta acessar uma rota que exige associação com empresa
  if (routesRequiringCompanyAccess.includes(currentPath) && userRole !== 'superadmin') {
    // Verificar se o usuário tem pelo menos uma empresa associada
    if (userCompanies.length === 0) {
      console.error('[RouteGuard] Acesso negado: Usuário não tem nenhuma empresa associada');
      toast.error('Acesso negado: Você não tem acesso a nenhuma empresa no sistema');
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Verificar acesso à empresa específica se necessário
  if (requireCompanyAccess && !hasAccess) {
    console.error(`[RouteGuard] Acesso à empresa negado: ${requireCompanyAccess} não está associada ao usuário`);
    toast.error('Acesso negado: Você não tem acesso à empresa solicitada');
    return <Navigate to="/dashboard" replace />;
  }

  // Log de decisão final
  console.log(`[RouteGuard] Acesso concedido para rota: ${location.pathname}`);
  
  // Verificar acesso baseado em perfil
  return (
    <RoleCheck allowedRoles={allowedRoles}>
      {children}
    </RoleCheck>
  );
}
