
import React from 'react';
import { User } from '@supabase/supabase-js';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { AppRole } from '@/types';

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
