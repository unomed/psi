
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
        console.log("No user role found, setting default permissions");
        if (isMounted) {
          setLoadingPermission(false);
          setPermissions({});
        }
        return;
      }

      try {
        console.log("Fetching permissions for role:", userRole);
        const { data, error } = await supabase
          .from('permission_settings')
          .select('permissions')
          .eq('role', userRole)
          .single();

        if (!isMounted) return;

        if (error) {
          console.error('Error fetching permissions:', error);
          // Set default permissions based on role if database fetch fails
          const defaultPermissions = getDefaultPermissionsForRole(userRole);
          setPermissions(defaultPermissions);
        } else {
          console.log("Permissions data:", data.permissions);
          if (data.permissions && typeof data.permissions === 'object') {
            setPermissions(data.permissions as Record<string, boolean>);
          } else {
            console.error('Invalid permissions format:', data.permissions);
            const defaultPermissions = getDefaultPermissionsForRole(userRole);
            setPermissions(defaultPermissions);
          }
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error in permission check:', error);
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

  // Memoize and debounce the hasPermission function to prevent unnecessary re-renders
  const hasPermission = useCallback((permissionKey: string): boolean => {
    // If superadmin, always grant access
    if (userRole === 'superadmin') return true;
    
    // If permissions are still loading, deny access
    if (loadingPermission) return false;
    
    console.log(`Checking permission ${permissionKey} for role ${userRole}:`, 
      permissions ? permissions[permissionKey] : "no permissions data");
    
    // Check if key directly exists in permissions object
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

// Helper function to provide default permissions when database fails
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
    view_reports: false,
    export_reports: false,
    view_settings: false,
    edit_settings: false,
  };

  // Set basic permissions based on role
  switch (role) {
    case 'superadmin':
      // Superadmin gets all permissions
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
      defaultPermissions.view_reports = true;
      defaultPermissions.export_reports = true;
      break;
    case 'evaluator':
      defaultPermissions.view_dashboard = true;
      defaultPermissions.view_checklists = true;
      defaultPermissions.view_assessments = true;
      defaultPermissions.create_assessments = true;
      defaultPermissions.edit_assessments = true;
      break;
    default:
      defaultPermissions.view_dashboard = true;
      break;
  }

  return defaultPermissions;
}
