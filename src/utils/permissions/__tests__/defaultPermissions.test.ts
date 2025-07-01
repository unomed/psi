
import { getAllPermissions, getDefaultPermissionsForRole } from '../defaultPermissions';

describe('defaultPermissions', () => {
  describe('getAllPermissions', () => {
    it('should return all permissions set to true', () => {
      const allPermissions = getAllPermissions();

      expect(allPermissions).toBeDefined();
      expect(typeof allPermissions).toBe('object');

      // Verificar algumas permissões específicas
      expect(allPermissions.view_dashboard).toBe(true);
      expect(allPermissions.manage_users).toBe(true);
      expect(allPermissions.view_companies).toBe(true);
      expect(allPermissions.manage_permissions).toBe(true);

      // Verificar que todas as permissões são true
      Object.values(allPermissions).forEach(permission => {
        expect(permission).toBe(true);
      });
    });
  });

  describe('getDefaultPermissionsForRole', () => {
    it('should return correct permissions for admin role', () => {
      const adminPermissions = getDefaultPermissionsForRole('admin');

      expect(adminPermissions.view_dashboard).toBe(true);
      expect(adminPermissions.view_employees).toBe(true);
      expect(adminPermissions.create_employees).toBe(true);
      expect(adminPermissions.edit_employees).toBe(true);
      expect(adminPermissions.delete_employees).toBe(true);
      expect(adminPermissions.view_settings).toBe(true);

      // Admin não deve ter acesso a empresas ou faturamento
      expect(adminPermissions.view_companies).toBe(false);
      expect(adminPermissions.view_billing).toBe(false);
    });

    it('should return correct permissions for evaluator role', () => {
      const evaluatorPermissions = getDefaultPermissionsForRole('evaluator');

      expect(evaluatorPermissions.view_dashboard).toBe(true);
      expect(evaluatorPermissions.view_checklists).toBe(true);
      expect(evaluatorPermissions.create_checklists).toBe(true);
      expect(evaluatorPermissions.edit_checklists).toBe(true);
      expect(evaluatorPermissions.view_assessments).toBe(true);
      expect(evaluatorPermissions.create_assessments).toBe(true);

      // Evaluator não deve ter acesso a gestão de usuários
      expect(evaluatorPermissions.manage_users).toBe(false);
      expect(evaluatorPermissions.manage_permissions).toBe(false);
    });

    it('should return correct permissions for profissionais role', () => {
      const profissionaisPermissions = getDefaultPermissionsForRole('profissionais');

      expect(profissionaisPermissions.view_dashboard).toBe(true);
      expect(profissionaisPermissions.view_checklists).toBe(true);
      expect(profissionaisPermissions.view_assessments).toBe(true);
      expect(profissionaisPermissions.view_scheduling).toBe(true);
      expect(profissionaisPermissions.view_results).toBe(true);

      // Profissionais não devem ter permissões de criação/edição
      expect(profissionaisPermissions.create_checklists).toBe(false);
      expect(profissionaisPermissions.edit_checklists).toBe(false);
      expect(profissionaisPermissions.create_assessments).toBe(false);
    });

    it('should return default permissions for unknown role', () => {
      const unknownPermissions = getDefaultPermissionsForRole('unknown_role');

      expect(unknownPermissions.view_dashboard).toBe(true);

      // Todas as outras permissões devem ser false
      const otherPermissions = Object.keys(unknownPermissions)
        .filter(key => key !== 'view_dashboard');

      otherPermissions.forEach(permission => {
        expect(unknownPermissions[permission]).toBe(false);
      });
    });

    it('should have consistent structure across all roles', () => {
      const roles = ['admin', 'evaluator', 'profissionais', 'unknown'];
      const permissionKeys = Object.keys(getAllPermissions());

      roles.forEach(role => {
        const rolePermissions = getDefaultPermissionsForRole(role);
        const roleKeys = Object.keys(rolePermissions);

        // Verificar que todas as permissões estão presentes
        expect(roleKeys.sort()).toEqual(permissionKeys.sort());

        // Verificar que todos os valores são booleanos
        Object.values(rolePermissions).forEach(permission => {
          expect(typeof permission).toBe('boolean');
        });
      });
    });
  });
});
