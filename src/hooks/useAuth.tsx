
import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Use a specific type for roles matching the Supabase enum
type AppRole = 'superadmin' | 'admin' | 'evaluator';

interface AuthContextType {
  user: User | null;
  hasRole: (role: AppRole) => Promise<boolean>;
  hasCompanyAccess: (companyId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // If used outside of the provider, provide a default implementation
    return {
      user: null,
      hasRole: async (role: AppRole) => {
        // Since we're outside the provider, check directly with Supabase
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return false;
          
          const { data, error } = await supabase
            .rpc('has_role', { _user_id: user.id, _role: role });
            
          if (error) {
            console.error('Error checking role:', error);
            return false;
          }
          
          return data || false;
        } catch (error) {
          console.error('Error checking role:', error);
          return false;
        }
      },
      hasCompanyAccess: async (companyId: string) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return false;
          
          // Check if superadmin (they have access to all companies)
          const { data: isSuperadmin, error: roleError } = await supabase
            .rpc('has_role', { _user_id: user.id, _role: 'superadmin' });
            
          if (roleError) {
            console.error('Error checking role:', roleError);
            return false;
          }
          
          if (isSuperadmin) return true;
          
          // If not superadmin, check if user has access to this specific company
          const { data, error } = await supabase
            .from('company_users')
            .select('*')
            .eq('user_id', user.id)
            .eq('company_id', companyId)
            .single();
            
          if (error) {
            console.error('Error checking company access:', error);
            return false;
          }
          
          return !!data;
        } catch (error) {
          console.error('Error checking company access:', error);
          return false;
        }
      }
    };
  }
  return context;
}

export default useAuth;
