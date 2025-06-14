
export function createDefaultPermissions() {
  return [
    {
      role: 'superadmin',
      permissions: createFullPermissions(true)
    },
    {
      role: 'admin',
      permissions: createAdminPermissions()
    },
    {
      role: 'evaluator',
      permissions: createEvaluatorPermissions()
    },
    {
      role: 'profissionais',
      permissions: createProfissionalPermissions()
    }
  ];
}

export function createFullPermissions(value: boolean): Record<string, boolean> {
  return {
    view_dashboard: value,
    view_companies: value,
    create_companies: value,
    edit_companies: value,
    delete_companies: value,
    view_employees: value,
    create_employees: value,
    edit_employees: value,
    delete_employees: value,
    view_sectors: value,
    create_sectors: value,
    edit_sectors: value,
    delete_sectors: value,
    view_functions: value,
    create_functions: value,
    edit_functions: value,
    delete_functions: value,
    view_checklists: value,
    create_checklists: value,
    edit_checklists: value,
    delete_checklists: value,
    view_assessments: value,
    create_assessments: value,
    edit_assessments: value,
    delete_assessments: value,
    view_scheduling: value,
    create_scheduling: value,
    edit_scheduling: value,
    delete_scheduling: value,
    view_results: value,
    export_results: value,
    analyze_results: value,
    view_risk_management: value,
    create_risk_plans: value,
    edit_risk_matrix: value,
    view_action_plans: value,
    create_action_plans: value,
    edit_action_plans: value,
    approve_action_plans: value,
    view_reports: value,
    export_reports: value,
    create_custom_reports: value,
    view_billing: value,
    manage_billing: value,
    view_invoices: value,
    view_settings: value,
    edit_settings: value,
    manage_users: value,
    manage_permissions: value,
  };
}

function createAdminPermissions(): Record<string, boolean> {
  const permissions = createFullPermissions(true);
  permissions.view_companies = false;
  permissions.create_companies = false;
  permissions.edit_companies = false;
  permissions.delete_companies = false;
  permissions.view_billing = false;
  permissions.manage_billing = false;
  permissions.view_invoices = false;
  permissions.manage_permissions = false;
  return permissions;
}

function createEvaluatorPermissions(): Record<string, boolean> {
  const permissions = createFullPermissions(false);
  permissions.view_dashboard = true;
  permissions.view_checklists = true;
  permissions.create_checklists = true;
  permissions.edit_checklists = true;
  permissions.view_assessments = true;
  permissions.create_assessments = true;
  permissions.edit_assessments = true;
  permissions.view_scheduling = true;
  permissions.create_scheduling = true;
  permissions.edit_scheduling = true;
  permissions.view_results = true;
  permissions.export_results = true;
  return permissions;
}

function createProfissionalPermissions(): Record<string, boolean> {
  const permissions = createFullPermissions(false);
  permissions.view_dashboard = true;
  permissions.view_checklists = true;
  permissions.view_assessments = true;
  permissions.view_scheduling = true;
  permissions.view_results = true;
  return permissions;
}
