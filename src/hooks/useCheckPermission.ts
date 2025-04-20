
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
    console.log(`Checking permission ${permissionKey} for role ${userRole}:`, permissions ? permissions[permissionKey] : "no permissions data");
    
    // Check specific permission
    return permissions ? !!permissions[permissionKey] : false;
  };

  return {
    hasPermission,
    loadingPermission,
    permissions
  };
}
