
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
  console.log('[RouteGuard] Verificando acesso para rota:', location.pathname);
  console.log('[RouteGuard] Perfil do usuário:', userRole);
  console.log('[RouteGuard] Permissão requerida:', requirePermission);
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

  // Verificar permissão baseada nas permissões configuradas
  if (requirePermission && !hasPermission(requirePermission)) {
    toast.error(`Acesso negado: Você não tem permissão "${requirePermission}" para acessar esta funcionalidade`);
    console.error(`[RouteGuard] Permissão negada: ${requirePermission}`);
    return <Navigate to="/dashboard" replace />;
  }

  // Verificar acesso à empresa - ESTRITAMENTE baseado nas associações configuradas na página de usuários
  if (requireCompanyAccess && !hasAccess) {
    toast.error(`Acesso negado: Você não tem acesso à empresa solicitada`);
    console.error(`[RouteGuard] Acesso à empresa negado: ${requireCompanyAccess}`);
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
