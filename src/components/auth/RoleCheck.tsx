
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RoleCheckProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

export function RoleCheck({ allowedRoles, children }: RoleCheckProps) {
  const { userRole } = useAuth();

  console.log("[RoleCheck] Verificando se perfil do usuário:", userRole, "está nos perfis permitidos:", allowedRoles);

  // If there are no restricted roles, allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    console.log("[RoleCheck] Sem restrições de perfil, concedendo acesso");
    return <>{children}</>;
  }

  // Superadmin has access to everything
  if (userRole === 'superadmin') {
    console.log("[RoleCheck] Usuário é superadmin, concedendo acesso");
    return <>{children}</>;
  }

  // Check if the user's role is among the allowed ones
  const hasRole = userRole && allowedRoles.includes(userRole);
  
  if (!hasRole) {
    console.log("[RoleCheck] Acesso negado: Perfil do usuário", userRole, "não está nos perfis permitidos", allowedRoles);
    toast.error(`Acesso negado: Seu perfil (${userRole}) não tem permissão para acessar esta página`);
    return <Navigate to="/dashboard" replace />;
  }

  console.log("[RoleCheck] Acesso concedido: Perfil do usuário", userRole, "está permitido");
  return <>{children}</>;
}
