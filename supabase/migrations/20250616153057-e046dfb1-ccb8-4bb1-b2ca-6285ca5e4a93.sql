
-- Fase 1: Definir Roles & Permissions
-- 1. Atualizar usuário para superadmin
UPDATE user_roles 
SET role = 'superadmin'
WHERE user_id = (
    SELECT id FROM auth.users 
    WHERE email = 'gerencia@unomed.med.br'
);

-- 2. Padronizar permissões do perfil admin (remover permissões administrativas)
UPDATE permission_settings 
SET permissions = permissions || jsonb_build_object(
    'view_companies', false,
    'create_companies', false,
    'edit_companies', false,
    'delete_companies', false,
    'view_billing', false,
    'manage_billing', false,
    'view_invoices', false,
    'manage_permissions', false,
    'view_settings', true,  -- Admin pode ver configurações básicas
    'edit_settings', false  -- Mas não pode editar configurações do sistema
)
WHERE role = 'admin';

-- 3. Garantir que superadmin tenha TODAS as permissões
UPDATE permission_settings 
SET permissions = jsonb_build_object(
    'view_dashboard', true,
    'view_companies', true,
    'create_companies', true,
    'edit_companies', true,
    'delete_companies', true,
    'view_employees', true,
    'create_employees', true,
    'edit_employees', true,
    'delete_employees', true,
    'view_sectors', true,
    'create_sectors', true,
    'edit_sectors', true,
    'delete_sectors', true,
    'view_functions', true,
    'create_functions', true,
    'edit_functions', true,
    'delete_functions', true,
    'view_checklists', true,
    'create_checklists', true,
    'edit_checklists', true,
    'delete_checklists', true,
    'view_assessments', true,
    'create_assessments', true,
    'edit_assessments', true,
    'delete_assessments', true,
    'view_scheduling', true,
    'create_scheduling', true,
    'edit_scheduling', true,
    'delete_scheduling', true,
    'view_results', true,
    'export_results', true,
    'analyze_results', true,
    'view_risk_management', true,
    'create_risk_plans', true,
    'edit_risk_matrix', true,
    'view_action_plans', true,
    'create_action_plans', true,
    'edit_action_plans', true,
    'approve_action_plans', true,
    'view_reports', true,
    'export_reports', true,
    'create_custom_reports', true,
    'view_billing', true,
    'manage_billing', true,
    'view_invoices', true,
    'view_settings', true,
    'edit_settings', true,
    'manage_users', true,
    'manage_permissions', true
)
WHERE role = 'superadmin';

-- 4. Inserir configuração de superadmin se não existir
INSERT INTO permission_settings (role, permissions)
SELECT 'superadmin', jsonb_build_object(
    'view_dashboard', true,
    'view_companies', true,
    'create_companies', true,
    'edit_companies', true,
    'delete_companies', true,
    'view_employees', true,
    'create_employees', true,
    'edit_employees', true,
    'delete_employees', true,
    'view_sectors', true,
    'create_sectors', true,
    'edit_sectors', true,
    'delete_sectors', true,
    'view_functions', true,
    'create_functions', true,
    'edit_functions', true,
    'delete_functions', true,
    'view_checklists', true,
    'create_checklists', true,
    'edit_checklists', true,
    'delete_checklists', true,
    'view_assessments', true,
    'create_assessments', true,
    'edit_assessments', true,
    'delete_assessments', true,
    'view_scheduling', true,
    'create_scheduling', true,
    'edit_scheduling', true,
    'delete_scheduling', true,
    'view_results', true,
    'export_results', true,
    'analyze_results', true,
    'view_risk_management', true,
    'create_risk_plans', true,
    'edit_risk_matrix', true,
    'view_action_plans', true,
    'create_action_plans', true,
    'edit_action_plans', true,
    'approve_action_plans', true,
    'view_reports', true,
    'export_reports', true,
    'create_custom_reports', true,
    'view_billing', true,
    'manage_billing', true,
    'view_invoices', true,
    'view_settings', true,
    'edit_settings', true,
    'manage_users', true,
    'manage_permissions', true
)
WHERE NOT EXISTS (
    SELECT 1 FROM permission_settings WHERE role = 'superadmin'
);
