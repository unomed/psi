
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/types';

export function useRolePermissions() {
  const hasRole = async (role: AppRole): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .rpc('has_role', { 
          _user_id: user.id, 
          _role: role 
        });
        
      if (error) {
        console.error('Error checking role:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  };

  const hasCompanyAccess = async (companyId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const isSuperadmin = await hasRole('superadmin');
      if (isSuperadmin) return true;
      
      return false; // For now, until company_users table is implemented
    } catch (error) {
      console.error('Error checking company access:', error);
      return false;
    }
  };

  return { hasRole, hasCompanyAccess };
}
