
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoutePermissions } from '@/hooks/permissions/useRoutePermissions';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  routeKey: 'permissions' | 'users' | 'companies' | 'billing' | 'settings';
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  routeKey, 
  fallbackPath = '/dashboard' 
}: ProtectedRouteProps) {
  const { userRole, loading } = useAuth();
  const { canAccessRoute, getRouteAccessConfig } = useRoutePermissions();
  const location = useLocation();

  console.log('[ProtectedRoute] Verificando acesso para rota:', {
    routeKey,
    userRole,
    currentPath: location.pathname
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  const routeConfig = getRouteAccessConfig()[routeKey];
  const hasAccess = canAccessRoute(routeConfig);

  if (!hasAccess) {
    console.log('[ProtectedRoute] Acesso negado para:', routeKey);
    
    const routeNames = {
      permissions: 'gerenciar permissões',
      users: 'gerenciar usuários',
      companies: 'visualizar empresas',
      billing: 'visualizar faturamento',
      settings: 'acessar configurações'
    };
    
    toast.error(`Acesso negado: Você não tem permissão para ${routeNames[routeKey]}`);
    return <Navigate to={fallbackPath} replace />;
  }

  console.log('[ProtectedRoute] Acesso concedido para:', routeKey);
  return <>{children}</>;
}
