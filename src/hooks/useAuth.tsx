
import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  hasRole: (role: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // If used outside of the provider, provide a default implementation
    return {
      user: null,
      hasRole: async (role: string) => {
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
      }
    };
  }
  return context;
}

export default useAuth;
