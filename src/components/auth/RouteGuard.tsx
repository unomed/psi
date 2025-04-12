
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  // Para debug
  console.log("RouteGuard - Loading:", loading, "User:", !!user, "UserRole:", userRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Verificação de permissão de função apenas se allowedRoles estiver definido
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = userRole && allowedRoles.includes(userRole);
    
    console.log("RouteGuard - Role check:", { allowedRoles, userRole, hasRole });
    
    if (!hasRole) {
      // Redirecionar para a página inicial (dashboard)
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
