
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('[AdminGuard] Verificando acesso administrativo:', {
    hasUser: !!user,
    loading,
    currentPath: location.pathname
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    console.log('[AdminGuard] Usuário não autenticado, redirecionando para login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  console.log('[AdminGuard] Acesso administrativo concedido');
  return <>{children}</>;
}
