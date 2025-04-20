
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckPermission } from '@/hooks/useCheckPermission';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requirePermission?: string;
  requireCompanyAccess?: string;
}

export function RouteGuard({ children, allowedRoles, requirePermission, requireCompanyAccess }: RouteGuardProps) {
  const { user, loading, userRole } = useAuth();
  const { hasPermission, loadingPermission } = useCheckPermission();
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkCompanyAccess = async () => {
      if (!user || !requireCompanyAccess) {
        setCheckingAccess(false);
        return;
      }

      try {
        // Superadmin always has access
        if (userRole === 'superadmin') {
          setHasAccess(true);
          setCheckingAccess(false);
          return;
        }

        // Check if user has access to the required company
        const { data: userCompanies } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id);

        const hasCompanyAccess = userCompanies?.some(uc => uc.company_id === requireCompanyAccess) || false;
        setHasAccess(hasCompanyAccess);
      } catch (error) {
        console.error('Error checking company access:', error);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkCompanyAccess();
  }, [user, userRole, requireCompanyAccess]);

  // Show loading state while checking permissions and access
  if (loading || loadingPermission || checkingAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check authentication
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check permission
  if (requirePermission && !hasPermission(requirePermission)) {
    return <Navigate to="/" replace />;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = userRole && allowedRoles.includes(userRole);
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  // Check company access
  if (requireCompanyAccess && !hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
