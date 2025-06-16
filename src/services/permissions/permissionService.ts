
import { supabase } from '@/integrations/supabase/client';

export class PermissionService {
  static async fetchUserPermissions(userRole: string): Promise<Record<string, boolean> | null> {
    try {
      console.log("[PermissionService] Fetching permissions for role:", userRole);
      const { data, error } = await supabase
        .from('permission_settings')
        .select('permissions')
        .eq('role', userRole)
        .maybeSingle();

      if (error) {
        console.error('[PermissionService] Error fetching permissions:', error);
        return null;
      }

      if (data && data.permissions) {
        console.log("[PermissionService] Permissions data:", data.permissions);
        if (typeof data.permissions === 'object') {
          return data.permissions as Record<string, boolean>;
        } else {
          console.error('[PermissionService] Invalid permissions format:', data.permissions);
          return null;
        }
      }

      console.log("[PermissionService] No permissions found");
      return null;
    } catch (error) {
      console.error('[PermissionService] Error in permission fetch:', error);
      return null;
    }
  }
}
