
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckPermission } from '@/hooks/useCheckPermission';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requirePermission?: string;
  requireCompanyAccess?: string;
}

export function RouteGuard({ children, allowedRoles, requirePermission, requireCompanyAccess }: RouteGuardProps) {
  const { user, loading, userRole, hasCompanyAccess } = useAuth();
  const { hasPermission, loadingPermission } = useCheckPermission();
  const location = useLocation();

  // Para debug
  console.log("RouteGuard - Loading:", loading, "User:", !!user, "UserRole:", userRole);

  if (loading || loadingPermission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Permission-based access check
  if (requirePermission && !hasPermission(requirePermission)) {
    console.log(`User lacks permission: ${requirePermission}`);
    return <Navigate to="/" replace />;
  }

  // Role-based access check if allowedRoles is provided
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = userRole && allowedRoles.includes(userRole);
    
    console.log("RouteGuard - Role check:", { allowedRoles, userRole, hasRole });
    
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  // Company-based access check if requireCompanyAccess is provided
  if (requireCompanyAccess) {
    const checkCompanyAccess = async () => {
      const hasAccess = await hasCompanyAccess(requireCompanyAccess);
      if (!hasAccess) {
        return <Navigate to="/" replace />;
      }
    };
    
    checkCompanyAccess();
  }
  
  return <>{children}</>;
}
