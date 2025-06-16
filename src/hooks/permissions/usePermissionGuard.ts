
import { useCheckPermission } from '@/hooks/useCheckPermission';
import { useAuth } from '@/contexts/AuthContext';

export function usePermissionGuard() {
  const { userRole } = useAuth();
  const { hasPermission } = useCheckPermission();

  const canAccessPermissionsPage = () => {
    return userRole === 'superadmin';
  };

  const canAccessUsersPage = () => {
    return userRole === 'superadmin' || hasPermission('manage_users');
  };

  const canAccessCompaniesPage = () => {
    return userRole === 'superadmin' || hasPermission('view_companies');
  };

  const canAccessBillingPage = () => {
    return userRole === 'superadmin' || hasPermission('view_billing');
  };

  const canAccessSettingsPage = () => {
    return userRole === 'superadmin' || hasPermission('view_settings');
  };

  return {
    canAccessPermissionsPage,
    canAccessUsersPage,
    canAccessCompaniesPage,
    canAccessBillingPage,
    canAccessSettingsPage,
    hasPermission,
  };
}
