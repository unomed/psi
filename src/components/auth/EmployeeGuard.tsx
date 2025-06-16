
import { Navigate } from 'react-router-dom';
import { useEmployeeAuth } from '@/hooks/useEmployeeAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface EmployeeGuardProps {
  children: React.ReactNode;
}

export function EmployeeGuard({ children }: EmployeeGuardProps) {
  const { session, loading } = useEmployeeAuth();

  console.log('[EmployeeGuard] Verificando acesso de funcionário:', {
    hasSession: !!session,
    isAuthenticated: session?.isAuthenticated,
    loading
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session?.isAuthenticated) {
    console.log('[EmployeeGuard] Funcionário não autenticado, redirecionando');
    return <Navigate to="/auth/employee" replace />;
  }

  console.log('[EmployeeGuard] Acesso de funcionário concedido');
  return <>{children}</>;
}
