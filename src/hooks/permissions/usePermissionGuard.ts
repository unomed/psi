
import { usePermissionValidation } from './usePermissionValidation';

export function usePermissionGuard() {
  const { validatePermission, validateRole } = usePermissionValidation();

  const canAccessPermissionsPage = () => {
    return validateRole(['superadmin']);
  };

  const canAccessUsersPage = () => {
    return validateRole(['superadmin']) || validatePermission('manage_users');
  };

  const canAccessCompaniesPage = () => {
    return validateRole(['superadmin']) || validatePermission('view_companies');
  };

  const canAccessBillingPage = () => {
    return validateRole(['superadmin']) || validatePermission('view_billing');
  };

  const canAccessSettingsPage = () => {
    return validateRole(['superadmin', 'admin']) || validatePermission('view_settings');
  };

  return {
    canAccessPermissionsPage,
    canAccessUsersPage,
    canAccessCompaniesPage,
    canAccessBillingPage,
    canAccessSettingsPage,
    validatePermission,
    validateRole
  };
}
