
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
      role: 'user',
      permissions: createUserPermissions()
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
    view_reports: value,
    export_reports: value,
    view_settings: value,
    edit_settings: value,
  };
}

function createAdminPermissions(): Record<string, boolean> {
  const permissions = createFullPermissions(true);
  permissions.edit_settings = false;
  return permissions;
}

function createEvaluatorPermissions(): Record<string, boolean> {
  const permissions = createFullPermissions(false);
  permissions.view_dashboard = true;
  permissions.view_checklists = true;
  permissions.view_assessments = true;
  permissions.create_assessments = true;
  permissions.edit_assessments = true;
  return permissions;
}

function createUserPermissions(): Record<string, boolean> {
  const permissions = createFullPermissions(false);
  permissions.view_dashboard = true;
  return permissions;
}
