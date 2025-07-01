
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/types';

export function useRolePermissions() {
  const hasRole = async (role: AppRole): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Use type assertion to match the database's expected type
      const databaseRole = role === 'user' ? null : role as "superadmin" | "admin" | "evaluator";
      
      // If the requested role is 'user', we simply check if they're authenticated
      if (role === 'user') {
        return true; // All authenticated users have at least 'user' role
      }
      
      const { data, error } = await supabase
        .rpc('has_role', { 
          _user_id: user.id, 
          _role: databaseRole 
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
      
      // Check if user is superadmin (has access to all companies)
      const isSuperadmin = await hasRole('superadmin');
      if (isSuperadmin) return true;
      
      // For other roles, check the user_companies table
      const { data, error } = await supabase
        .rpc('has_company_access', {
          _user_id: user.id,
          _company_id: companyId
        });
        
      if (error) {
        console.error('Error checking company access:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('Error checking company access:', error);
      return false;
    }
  };

  return { hasRole, hasCompanyAccess };
}
