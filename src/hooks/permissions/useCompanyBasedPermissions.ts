import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';

export function useCompanyBasedPermissions() {
  const { userRole } = useAuth();
  const { selectedCompanyId, isCompanySelected } = useCompany();

  const isMenuAllowed = (menuKey: string, requiredPermission?: string, allowedRoles?: string[]): boolean => {
    console.log('[useCompanyBasedPermissions] Checking menu:', {
      menuKey,
      userRole,
      selectedCompanyId,
      isCompanySelected,
      requiredPermission,
      allowedRoles
    });

    // Superadmin sempre tem acesso
    if (userRole === 'superadmin') {
      return true;
    }

    // Se não é superadmin, aplicar regras específicas
    if (userRole !== 'superadmin') {
      
      // Menus que devem ser bloqueados para admin de empresa específica
      const superAdminOnlyMenus = [
        'empresas',        // Gestão de empresas só para superadmin
        'faturamento',     // Faturamento só para superadmin
        'usuarios',        // Gestão de usuários só para superadmin  
        'permissoes'       // Gestão de permissões só para superadmin
      ];

      // Verificar se é um menu específico de superadmin
      if (superAdminOnlyMenus.includes(menuKey)) {
        console.log('[useCompanyBasedPermissions] Menu blocked for non-superadmin:', menuKey);
        return false;
      }

      // Verificar por permission também
      if (requiredPermission) {
        const superAdminOnlyPermissions = [
          'view_companies',
          'manage_users', 
          'manage_permissions',
          'view_billing'
        ];
        
        if (superAdminOnlyPermissions.includes(requiredPermission)) {
          console.log('[useCompanyBasedPermissions] Permission blocked for non-superadmin:', requiredPermission);
          return false;
        }
      }
    }

    // Verificar roles permitidas
    if (allowedRoles && userRole) {
      const hasRole = allowedRoles.includes(userRole);
      console.log('[useCompanyBasedPermissions] Role check result:', {
        userRole,
        allowedRoles,
        hasRole
      });
      return hasRole;
    }

    // Default: permitir acesso se passou pelas validações
    return true;
  };

  return {
    isMenuAllowed,
    selectedCompanyId,
    isCompanySelected,
    userRole
  };
}