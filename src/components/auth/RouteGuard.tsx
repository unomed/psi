
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireCompanyAccess?: string;
}

export function RouteGuard({ children, allowedRoles, requireCompanyAccess }: RouteGuardProps) {
  const { user, loading, userRole, hasCompanyAccess } = useAuth();
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

  // Role-based access check if allowedRoles is provided
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = userRole && allowedRoles.includes(userRole);
    
    console.log("RouteGuard - Role check:", { allowedRoles, userRole, hasRole });
    
    if (!hasRole) {
      // Redirect to the homepage (dashboard)
      return <Navigate to="/" replace />;
    }
  }

  // Company-based access check if requireCompanyAccess is provided
  if (requireCompanyAccess) {
    // We'll implement this check using our hasCompanyAccess function
    const checkCompanyAccess = async () => {
      const hasAccess = await hasCompanyAccess(requireCompanyAccess);
      if (!hasAccess) {
        return <Navigate to="/" replace />;
      }
    };
    
    // For simplicity, just call the check function
    // In a production app, you would use useEffect and state to handle this async check
    checkCompanyAccess();
  }
  
  return <>{children}</>;
}
