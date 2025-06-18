
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeAuthNative } from '@/contexts/EmployeeAuthNative';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface SafeEmployeeGuardProps {
  children: React.ReactNode;
}

export function SafeEmployeeGuard({ children }: SafeEmployeeGuardProps) {
  const { session, loading } = useEmployeeAuthNative();
  const [isNavigateReady, setIsNavigateReady] = useState(false);
  const navigate = useNavigate();

  // Wait for navigation to be ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigateReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  console.log('[SafeEmployeeGuard] Verificando acesso de funcionário:', {
    hasSession: !!session,
    isAuthenticated: session?.isAuthenticated,
    loading,
    isNavigateReady
  });

  if (loading || !isNavigateReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session?.isAuthenticated) {
    console.log('[SafeEmployeeGuard] Funcionário não autenticado, redirecionando');
    
    // Use setTimeout to ensure navigation happens after render
    useEffect(() => {
      if (isNavigateReady && !loading) {
        const timer = setTimeout(() => {
          navigate('/auth/employee', { replace: true });
        }, 0);
        return () => clearTimeout(timer);
      }
    }, [navigate, isNavigateReady, loading]);

    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  console.log('[SafeEmployeeGuard] Acesso de funcionário concedido');
  return <>{children}</>;
}
