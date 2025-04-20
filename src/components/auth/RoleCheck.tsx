
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RoleCheckProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

export function RoleCheck({ allowedRoles, children }: RoleCheckProps) {
  const { userRole } = useAuth();

  console.log("[RoleCheck] Checking if user role:", userRole, "is in allowed roles:", allowedRoles);

  // Se não há papéis restritos, permita o acesso
  if (!allowedRoles || allowedRoles.length === 0) {
    console.log("[RoleCheck] No role restrictions, granting access");
    return <>{children}</>;
  }

  // Superadmin tem acesso a tudo
  if (userRole === 'superadmin') {
    console.log("[RoleCheck] User is superadmin, granting access");
    return <>{children}</>;
  }

  // Verifica se o papel do usuário está entre os permitidos
  const hasRole = userRole && allowedRoles.includes(userRole);
  
  if (!hasRole) {
    console.log("[RoleCheck] Access denied: User role", userRole, "not in allowed roles", allowedRoles);
    toast.error(`Acesso negado: Seu perfil (${userRole}) não tem permissão para acessar esta página`);
    return <Navigate to="/dashboard" replace />;
  }

  console.log("[RoleCheck] Access granted: User role", userRole, "is allowed");
  return <>{children}</>;
}
