
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/auth/LoadingSpinner';

const Index = () => {
  const { user, loading } = useAuth();

  // Log para debug
  useEffect(() => {
    console.log('[Index] Estado:', { hasUser: !!user, loading });
  }, [user, loading]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirecionar baseado no estado de autenticação
  if (user) {
    console.log('[Index] Usuário autenticado, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  } else {
    console.log('[Index] Usuário não autenticado, redirecionando para login do funcionário');
    return <Navigate to="/auth/employee" replace />;
  }
};

export default Index;
