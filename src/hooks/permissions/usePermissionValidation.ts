import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCheckPermission } from '@/hooks/useCheckPermission';

export function usePermissionValidation() {
  const { userRole } = useAuth();
  const { hasPermission } = useCheckPermission();

  const validatePermission = (permission: string): boolean => {
    // Superadmin sempre tem acesso
    if (userRole === 'superadmin') return true;
    
    // Verificar permissão específica
    return hasPermission(permission);
  };

  const validateRole = (allowedRoles: string[]): boolean => {
    // Superadmin sempre tem acesso
    if (userRole === 'superadmin') return true;
    
    // Verificar se o papel está na lista permitida
    return userRole ? allowedRoles.includes(userRole) : false;
  };

  const validateMultiplePermissions = (permissions: string[], requireAll = false): boolean => {
    if (userRole === 'superadmin') return true;
    
    if (requireAll) {
      return permissions.every(permission => hasPermission(permission));
    } else {
      return permissions.some(permission => hasPermission(permission));
    }
  };

  // Nova função para validação completa do sistema de permissões
  const validatePermissionSystem = (): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Verificar se o usuário tem um papel válido
    if (!userRole) {
      errors.push('Usuário não possui papel definido');
    }

    // Verificar se o superadmin tem todas as permissões
    if (userRole === 'superadmin') {
      const requiredPermissions = [
        'manage_permissions', 
        'manage_users', 
        'view_companies'
      ];
      
      const missingPermissions = requiredPermissions.filter(
        permission => !hasPermission(permission)
      );
      
      if (missingPermissions.length > 0) {
        errors.push(`Superadmin não possui permissões essenciais: ${missingPermissions.join(', ')}`);
      }
    }

    // Verificar consistência de permissões por papel
    if (userRole && userRole !== 'superadmin') {
      // Admin deve ter acesso ao dashboard
      if (userRole === 'admin' && !hasPermission('view_dashboard')) {
        errors.push('Admin deve ter acesso ao dashboard');
      }

      // Evaluator deve poder visualizar avaliações
      if (userRole === 'evaluator' && !hasPermission('view_assessments')) {
        errors.push('Evaluator deve poder visualizar avaliações');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  return {
    validatePermission,
    validateRole,
    validateMultiplePermissions,
    validatePermissionSystem,
    userRole,
    hasPermission
  };
}
