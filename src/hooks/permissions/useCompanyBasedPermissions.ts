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

    // Se não é superadmin e uma empresa está selecionada
    if (isCompanySelected && userRole !== 'superadmin') {
      
      // Menus que devem ser bloqueados para admin de empresa específica
      const superAdminOnlyMenus = {
        'empresas': true,        // Gestão de empresas só para superadmin
        'faturamento': true,     // Faturamento só para superadmin
        'usuarios': true,        // Gestão de usuários só para superadmin
        'permissoes': true       // Gestão de permissões só para superadmin
      };

      // Verificar se é um menu específico de superadmin
      if (superAdminOnlyMenus[menuKey as keyof typeof superAdminOnlyMenus]) {
        console.log('[useCompanyBasedPermissions] Menu blocked for company admin:', menuKey);
        return false;
      }

      // Verificar por permission também
      if (requiredPermission) {
        const permissionResource = requiredPermission.split(':')[0];
        
        if (permissionResource === 'companies' && menuKey === 'empresas') {
          console.log('[useCompanyBasedPermissions] Companies permission blocked for company admin');
          return false;
        }
        
        if (permissionResource === 'billing' && menuKey === 'faturamento') {
          console.log('[useCompanyBasedPermissions] Billing permission blocked for company admin');
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