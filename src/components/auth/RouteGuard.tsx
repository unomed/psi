
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckPermission } from '@/hooks/useCheckPermission';
import { useCompanyAccess } from '@/hooks/useCompanyAccess';
import { RoleCheck } from './RoleCheck';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'sonner';
import { useRef, useEffect } from 'react';

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
  
  // Proteção contra loop infinito
  const redirectAttempts = useRef(0);
  const lastRedirectTime = useRef(0);
  const maxRedirectAttempts = 3;
  const redirectCooldown = 2000; // 2 segundos

  // Verificar se já passou tempo suficiente desde o último redirecionamento
  const canRedirect = () => {
    const now = Date.now();
    const timeSinceLastRedirect = now - lastRedirectTime.current;
    
    if (timeSinceLastRedirect > redirectCooldown) {
      redirectAttempts.current = 0;
    }
    
    return redirectAttempts.current < maxRedirectAttempts && timeSinceLastRedirect > 500;
  };

  // Função para executar redirecionamento seguro
  const safeRedirect = (path: string, reason: string) => {
    if (canRedirect()) {
      console.log(`[RouteGuard] Redirecionando para ${path} - Razão: ${reason}`);
      redirectAttempts.current++;
      lastRedirectTime.current = Date.now();
      return true;
    }
    console.warn(`[RouteGuard] Redirecionamento bloqueado para evitar loop - Tentativas: ${redirectAttempts.current}`);
    return false;
  };

  // Debug logs - mais controlados
  useEffect(() => {
    console.log('[RouteGuard] Estado atual:', {
      rota: location.pathname,
      user: !!user,
      userRole,
      loading,
      loadingPermission,
      checkingAccess,
      redirectAttempts: redirectAttempts.current
    });
  }, [location.pathname, user, userRole, loading, loadingPermission, checkingAccess]);

  // Mostrar loading enquanto verifica permissões e acesso
  if (loading || loadingPermission || checkingAccess) {
    console.log('[RouteGuard] Aguardando carregamento...');
    return <LoadingSpinner />;
  }

  // Verificar autenticação - primeira prioridade
  if (!user) {
    console.log('[RouteGuard] Usuário não autenticado');
    
    if (safeRedirect('/auth/login', 'Usuário não autenticado')) {
      toast.error('Você precisa estar logado para acessar esta página');
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    
    // Se não pode redirecionar (para evitar loop), mostrar loading
    return <LoadingSpinner />;
  }

  // Tratamento especial para dashboard - sempre permitir se autenticado
  if (location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard')) {
    console.log('[RouteGuard] Rota de dashboard, permitindo acesso');
    return (
      <RoleCheck allowedRoles={allowedRoles}>
        {children}
      </RoleCheck>
    );
  }

  // Verificar permissão específica (apenas se não for dashboard)
  if (requirePermission && !hasPermission(requirePermission)) {
    console.log(`[RouteGuard] Permissão negada: ${requirePermission} para perfil ${userRole}`);
    
    if (safeRedirect('/dashboard', `Permissão negada: ${requirePermission}`)) {
      toast.error(`Acesso negado: Você não tem permissão "${requirePermission}" para acessar esta funcionalidade`);
      return <Navigate to="/dashboard" replace />;
    }
    
    return <LoadingSpinner />;
  }

  // Verificar acesso à empresa (apenas se requireCompanyAccess for especificado)
  if (requireCompanyAccess === "any") {
    // Superadmin sempre tem acesso
    if (userRole === 'superadmin') {
      console.log('[RouteGuard] Usuário é superadmin, concedendo acesso');
    } else {
      // Para outros perfis, verificar se tem pelo menos uma empresa
      if (!userCompanies || userCompanies.length === 0) {
        console.log('[RouteGuard] Usuário não tem empresas associadas');
        
        if (safeRedirect('/dashboard', 'Sem empresas associadas')) {
          toast.error('Acesso negado: Você não tem acesso a nenhuma empresa no sistema');
          return <Navigate to="/dashboard" replace />;
        }
        
        return <LoadingSpinner />;
      }
      
      // Verificação adicional usando o hook useCompanyAccess
      if (!hasAccess) {
        console.log('[RouteGuard] Verificação de acesso à empresa falhou');
        
        if (safeRedirect('/dashboard', 'Acesso à empresa negado')) {
          toast.error('Acesso negado: Você não tem acesso necessário para esta funcionalidade');
          return <Navigate to="/dashboard" replace />;
        }
        
        return <LoadingSpinner />;
      }
    }
  }

  console.log(`[RouteGuard] Acesso concedido para rota: ${location.pathname}`);
  
  // Verificar acesso baseado em papel
  return (
    <RoleCheck allowedRoles={allowedRoles}>
      {children}
    </RoleCheck>
  );
}
