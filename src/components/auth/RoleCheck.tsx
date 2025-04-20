
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

  // Se não há perfis restritos, permita o acesso
  if (!allowedRoles || allowedRoles.length === 0) {
    console.log("[RoleCheck] Sem restrições de perfil, concedendo acesso");
    return <>{children}</>;
  }

  // Superadmin tem acesso a tudo
  if (userRole === 'superadmin') {
    console.log("[RoleCheck] Usuário é superadmin, concedendo acesso");
    return <>{children}</>;
  }

  // Verifica se o perfil do usuário está entre os permitidos
  const hasRole = userRole && allowedRoles.includes(userRole);
  
  if (!hasRole) {
    console.log("[RoleCheck] Acesso negado: Perfil do usuário", userRole, "não está nos perfis permitidos", allowedRoles);
    toast.error(`Acesso negado: Seu perfil (${userRole}) não tem permissão para acessar esta página`);
    return <Navigate to="/dashboard" replace />;
  }

  console.log("[RoleCheck] Acesso concedido: Perfil do usuário", userRole, "está permitido");
  return <>{children}</>;
}
