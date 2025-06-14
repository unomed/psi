
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
  
  // Proteção contra loop infinito - contador global de redirects
  const redirectAttempts = useRef(0);
  const lastRedirectTime = useRef(0);
  const maxRedirectAttempts = 2; // Reduzido para evitar loops
  const redirectCooldown = 1000; // 1 segundo

  // Reset contador após período de cooldown
  useEffect(() => {
    const now = Date.now();
    if (now - lastRedirectTime.current > redirectCooldown * 2) {
      redirectAttempts.current = 0;
    }
  }, [location.pathname]);

  // Verificar se pode fazer redirect sem criar loop
  const canRedirect = () => {
    const now = Date.now();
    const timeSinceLastRedirect = now - lastRedirectTime.current;
    
    if (timeSinceLastRedirect > redirectCooldown) {
      redirectAttempts.current = 0;
    }
    
    return redirectAttempts.current < maxRedirectAttempts;
  };

  // Função para executar redirecionamento seguro
  const safeRedirect = (path: string, reason: string) => {
    if (canRedirect()) {
      console.log(`[RouteGuard] Redirecionando para ${path} - Razão: ${reason}`);
      redirectAttempts.current++;
      lastRedirectTime.current = Date.now();
      return true;
    }
    console.warn(`[RouteGuard] Loop de redirecionamento detectado - bloqueando redirect para ${path}`);
    return false;
  };

  // Debug logs mais controlados
  console.log('[RouteGuard] Estado:', {
    rota: location.pathname,
    hasUser: !!user,
    userRole,
    loading,
    loadingPermission,
    checkingAccess,
    redirectAttempts: redirectAttempts.current
  });

  // Se estiver carregando, mostrar loading
  const isLoading = loading || loadingPermission || checkingAccess;
  if (isLoading) {
    console.log('[RouteGuard] Aguardando carregamento...');
    return <LoadingSpinner />;
  }

  // Verificar autenticação - primeira prioridade
  if (!user) {
    console.log('[RouteGuard] Usuário não autenticado');
    
    // Evitar redirect se já estamos numa rota de auth
    if (location.pathname.startsWith('/auth')) {
      console.log('[RouteGuard] Já na rota de auth, permitindo acesso');
      return <>{children}</>;
    }
    
    if (safeRedirect('/auth/login', 'Usuário não autenticado')) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    
    // Se não pode redirecionar, mostrar loading para evitar erro
    return <LoadingSpinner />;
  }

  // Se usuário autenticado está tentando acessar rota de auth, redirecionar para dashboard
  if (user && location.pathname.startsWith('/auth')) {
    console.log('[RouteGuard] Usuário autenticado tentando acessar auth, redirecionando para dashboard');
    if (safeRedirect('/dashboard', 'Usuário já autenticado')) {
      return <Navigate to="/dashboard" replace />;
    }
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
