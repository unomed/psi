
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PermissionItem {
  resource?: string;
  actions?: string[];
}

export function useCheckPermission() {
  const { user, userRole } = useAuth();
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [permissions, setPermissions] = useState<Record<string, boolean> | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchPermissions = async () => {
      if (!userRole) {
        console.log("[useCheckPermission] No user role found, setting default permissions");
        if (isMounted) {
          setLoadingPermission(false);
          setPermissions({});
        }
        return;
      }

      try {
        console.log("[useCheckPermission] Fetching permissions for role:", userRole);
        const { data, error } = await supabase
          .from('permission_settings')
          .select('permissions')
          .eq('role', userRole)
          .maybeSingle();

        if (!isMounted) return;

        if (error) {
          console.error('[useCheckPermission] Error fetching permissions:', error);
          const defaultPermissions = getDefaultPermissionsForRole(userRole);
          setPermissions(defaultPermissions);
        } else if (data && data.permissions) {
          console.log("[useCheckPermission] Permissions data:", data.permissions);
          if (typeof data.permissions === 'object') {
            setPermissions(data.permissions as Record<string, boolean>);
          } else {
            console.error('[useCheckPermission] Invalid permissions format:', data.permissions);
            const defaultPermissions = getDefaultPermissionsForRole(userRole);
            setPermissions(defaultPermissions);
          }
        } else {
          console.log("[useCheckPermission] No permissions found, using defaults");
          const defaultPermissions = getDefaultPermissionsForRole(userRole);
          setPermissions(defaultPermissions);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('[useCheckPermission] Error in permission check:', error);
        const defaultPermissions = getDefaultPermissionsForRole(userRole);
        setPermissions(defaultPermissions);
      } finally {
        if (isMounted) {
          setLoadingPermission(false);
        }
      }
    };

    fetchPermissions();
    
    return () => {
      isMounted = false;
    };
  }, [userRole]);

  const hasPermission = useCallback((permissionKey: string): boolean => {
    if (userRole === 'superadmin') return true;
    
    if (loadingPermission) return false;
    
    console.log(`[useCheckPermission] Checking permission ${permissionKey} for role ${userRole}:`, 
      permissions ? permissions[permissionKey] : "no permissions data");
    
    if (permissions && permissions[permissionKey] === true) {
      return true;
    }
    
    return false;
  }, [userRole, loadingPermission, permissions]);

  return {
    hasPermission,
    loadingPermission,
    permissions
  };
}

function getDefaultPermissionsForRole(role: string): Record<string, boolean> {
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
    case 'superadmin':
      Object.keys(defaultPermissions).forEach(key => {
        defaultPermissions[key] = true;
      });
      break;
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
      defaultPermissions.edit_functions = true;
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
      defaultPermissions.manage_users = true;
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
