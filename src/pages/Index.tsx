
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Index = () => {
  const { user, loading } = useSimpleAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirecionar baseado no estado de autenticação
  if (user) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/auth/login" replace />;
  }
};

export default Index;
