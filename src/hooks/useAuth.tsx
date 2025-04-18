
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Use a specific type for roles matching the Supabase enum
type AppRole = 'superadmin' | 'admin' | 'evaluator';

interface DirectAuthContextType {
  user: User | null;
  hasRole: (role: AppRole) => Promise<boolean>;
  hasCompanyAccess: (companyId: string) => Promise<boolean>;
}

export function useAuth(): DirectAuthContextType {
  // Use the context-based authentication
  const context = useAuthContext();
  
  // Return a subset of the context to avoid circular dependencies
  return {
    user: context.user,
    hasRole: context.hasRole,
    hasCompanyAccess: context.hasCompanyAccess
  };
}

export default useAuth;
