
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCheckPermission() {
  const { user, userRole } = useAuth();
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [permissions, setPermissions] = useState<Record<string, boolean> | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!userRole) {
        setLoadingPermission(false);
        return;
      }

      try {
        console.log("Fetching permissions for role:", userRole);
        const { data, error } = await supabase
          .from('permission_settings')
          .select('permissions')
          .eq('role', userRole)
          .single();

        if (error) {
          console.error('Error fetching permissions:', error);
          setPermissions(null);
        } else {
          console.log("Permissions data:", data.permissions);
          // Type checking and conversion to ensure we have the correct type
          if (data.permissions && typeof data.permissions === 'object') {
            setPermissions(data.permissions as Record<string, boolean>);
          } else {
            console.error('Invalid permissions format:', data.permissions);
            setPermissions(null);
          }
        }
      } catch (error) {
        console.error('Error in permission check:', error);
        setPermissions(null);
      } finally {
        setLoadingPermission(false);
      }
    };

    fetchPermissions();
  }, [userRole]);

  const hasPermission = (permissionKey: string): boolean => {
    // If superadmin, always grant access
    if (userRole === 'superadmin') return true;
    
    // For debugging
    console.log(`Checking permission ${permissionKey} for role ${userRole}:`, 
      permissions ? JSON.stringify(permissions[permissionKey]) : "no permissions data");
    
    // Check if key directly exists in permissions object
    if (permissions && permissions[permissionKey] === true) {
      return true;
    }
    
    // Handle the nested structure format
    // For backward compatibility with the original structure format
    if (permissions) {
      // Convert numeric keys to array entries if needed
      const resourcesArray = Object.entries(permissions)
        .filter(([key]) => !isNaN(Number(key)))
        .map(([_, value]) => {
          // Only map objects, skip boolean values
          return typeof value === 'object' ? value : null;
        })
        .filter((item): item is Record<string, any> => item !== null);
        
      // Check if permission exists in nested structure
      for (const item of resourcesArray) {
        if (item && 
            typeof item === 'object' && 
            'resource' in item && 
            'actions' in item && 
            Array.isArray(item.actions)) {
          const [action, resource] = permissionKey.split('_');
          if (item.resource === resource && item.actions.includes(action)) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  return {
    hasPermission,
    loadingPermission,
    permissions
  };
}
