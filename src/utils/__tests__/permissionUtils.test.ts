
import { createFullPermissions } from '../permissionUtils';

describe('permissionUtils', () => {
  describe('createFullPermissions', () => {
    it('should create permissions object with all values set to true', () => {
      const permissions = createFullPermissions(true);

      expect(permissions).toBeDefined();
      expect(typeof permissions).toBe('object');

      // Verificar algumas permissões específicas
      expect(permissions.view_dashboard).toBe(true);
      expect(permissions.manage_users).toBe(true);
      expect(permissions.view_companies).toBe(true);
      expect(permissions.manage_permissions).toBe(true);

      // Verificar que todas as permissões têm o valor correto
      Object.values(permissions).forEach(permission => {
        expect(permission).toBe(true);
      });
    });

    it('should create permissions object with all values set to false', () => {
      const permissions = createFullPermissions(false);

      expect(permissions).toBeDefined();
      expect(typeof permissions).toBe('object');

      // Verificar que todas as permissões têm o valor correto
      Object.values(permissions).forEach(permission => {
        expect(permission).toBe(false);
      });
    });

    it('should include all expected permission keys', () => {
      const permissions = createFullPermissions(true);
      const expectedKeys = [
        'view_dashboard',
        'view_companies',
        'create_companies',
        'edit_companies',
        'delete_companies',
        'view_employees',
        'create_employees',
        'edit_employees',
        'delete_employees',
        'view_sectors',
        'create_sectors',
        'edit_sectors',
        'delete_sectors',
        'view_functions',
        'create_functions',
        'edit_functions',
        'delete_functions',
        'view_checklists',
        'create_checklists',
        'edit_checklists',
        'delete_checklists',
        'view_assessments',
        'create_assessments',
        'edit_assessments',
        'delete_assessments',
        'view_scheduling',
        'create_scheduling',
        'edit_scheduling',
        'delete_scheduling',
        'view_results',
        'export_results',
        'analyze_results',
        'view_risk_management',
        'create_risk_plans',
        'edit_risk_matrix',
        'view_action_plans',
        'create_action_plans',
        'edit_action_plans',
        'approve_action_plans',
        'view_reports',
        'export_reports',
        'create_custom_reports',
        'view_billing',
        'manage_billing',
        'view_invoices',
        'view_settings',
        'edit_settings',
        'manage_users',
        'manage_permissions'
      ];

      const actualKeys = Object.keys(permissions);
      expect(actualKeys.sort()).toEqual(expectedKeys.sort());
    });
  });
});
