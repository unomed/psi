
export function getAllPermissions(): Record<string, boolean> {
  return {
    view_dashboard: true,
    view_companies: true,
    create_companies: true,
    edit_companies: true,
    delete_companies: true,
    view_employees: true,
    create_employees: true,
    edit_employees: true,
    delete_employees: true,
    view_sectors: true,
    create_sectors: true,
    edit_sectors: true,
    delete_sectors: true,
    view_functions: true,
    create_functions: true,
    edit_functions: true,
    delete_functions: true,
    view_checklists: true,
    create_checklists: true,
    edit_checklists: true,
    delete_checklists: true,
    view_assessments: true,
    create_assessments: true,
    edit_assessments: true,
    delete_assessments: true,
    view_scheduling: true,
    create_scheduling: true,
    edit_scheduling: true,
    delete_scheduling: true,
    view_results: true,
    export_results: true,
    analyze_results: true,
    view_risk_management: true,
    create_risk_plans: true,
    edit_risk_matrix: true,
    view_action_plans: true,
    create_action_plans: true,
    edit_action_plans: true,
    approve_action_plans: true,
    view_reports: true,
    export_reports: true,
    create_custom_reports: true,
    view_billing: true,
    manage_billing: true,
    view_invoices: true,
    view_settings: true,
    edit_settings: true,
    manage_users: true,
    manage_permissions: true,
  };
}

export function getDefaultPermissionsForRole(role: string): Record<string, boolean> {
  const defaultPermissions: Record<string, boolean> = {
    view_dashboard: false,
    view_companies: false,
    create_companies: false,
    edit_companies: false,
    delete_companies: false,
    view_employees: false,
    create_employees: false,
    edit_employees: false,
    delete_employees: false,
    view_sectors: false,
    create_sectors: false,
    edit_sectors: false,
    delete_sectors: false,
    view_functions: false,
    create_functions: false,
    edit_functions: false,
    delete_functions: false,
    view_checklists: false,
    create_checklists: false,
    edit_checklists: false,
    delete_checklists: false,
    view_assessments: false,
    create_assessments: false,
    edit_assessments: false,
    delete_assessments: false,
    view_scheduling: false,
    create_scheduling: false,
    edit_scheduling: false,
    delete_scheduling: false,
    view_results: false,
    export_results: false,
    analyze_results: false,
    view_risk_management: false,
    create_risk_plans: false,
    edit_risk_matrix: false,
    view_action_plans: false,
    create_action_plans: false,
    edit_action_plans: false,
    approve_action_plans: false,
    view_reports: false,
    export_reports: false,
    create_custom_reports: false,
    view_billing: false,
    manage_billing: false,
    view_invoices: false,
    view_settings: false,
    edit_settings: false,
    manage_users: false,
    manage_permissions: false,
  };

  switch (role) {
    case 'admin':
      defaultPermissions.view_dashboard = true;
      defaultPermissions.view_employees = true;
      defaultPermissions.create_employees = true;
      defaultPermissions.edit_employees = true;
      defaultPermissions.delete_employees = true;
      defaultPermissions.view_sectors = true;
      defaultPermissions.create_sectors = true;
      defaultPermissions.edit_sectors = true;
      defaultPermissions.delete_sectors = true;
      defaultPermissions.view_functions = true;
      defaultPermissions.create_functions = true;
      defaultPermissions.edit_functions = true,
      defaultPermissions.delete_functions = true;
      defaultPermissions.view_checklists = true;
      defaultPermissions.create_checklists = true;
      defaultPermissions.edit_checklists = true;
      defaultPermissions.delete_checklists = true;
      defaultPermissions.view_assessments = true;
      defaultPermissions.create_assessments = true;
      defaultPermissions.edit_assessments = true;
      defaultPermissions.delete_assessments = true;
      defaultPermissions.view_scheduling = true;
      defaultPermissions.create_scheduling = true;
      defaultPermissions.edit_scheduling = true;
      defaultPermissions.view_results = true;
      defaultPermissions.export_results = true;
      defaultPermissions.view_risk_management = true;
      defaultPermissions.create_risk_plans = true;
      defaultPermissions.edit_risk_matrix = true;
      defaultPermissions.view_action_plans = true;
      defaultPermissions.create_action_plans = true;
      defaultPermissions.edit_action_plans = true;
      defaultPermissions.view_reports = true;
      defaultPermissions.export_reports = true;
      defaultPermissions.view_settings = true;
      break;
    case 'evaluator':
      defaultPermissions.view_dashboard = true;
      defaultPermissions.view_checklists = true;
      defaultPermissions.create_checklists = true;
      defaultPermissions.edit_checklists = true;
      defaultPermissions.view_assessments = true;
      defaultPermissions.create_assessments = true;
      defaultPermissions.edit_assessments = true;
      defaultPermissions.view_scheduling = true;
      defaultPermissions.create_scheduling = true;
      defaultPermissions.edit_scheduling = true;
      defaultPermissions.view_results = true;
      defaultPermissions.export_results = true;
      break;
    case 'profissionais':
      defaultPermissions.view_dashboard = true;
      defaultPermissions.view_checklists = true;
      defaultPermissions.view_assessments = true;
      defaultPermissions.view_scheduling = true;
      defaultPermissions.view_results = true;
      break;
    default:
      defaultPermissions.view_dashboard = true;
      break;
  }

  return defaultPermissions;
}
