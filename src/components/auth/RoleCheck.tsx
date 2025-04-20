
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleCheckProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

export function RoleCheck({ allowedRoles, children }: RoleCheckProps) {
  const { userRole } = useAuth();

  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  const hasRole = userRole && allowedRoles.includes(userRole);
  if (!hasRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
