
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { SimpleAuthContextType, AppRole, CompanyAccess } from '@/types';

const AuthContext = createContext<SimpleAuthContextType>({
  user: null,
  session: null,
  loading: true,
  userRole: null,
  userCompanies: [],
  signIn: async () => {},
  signOut: async () => {}
});

export function useAuth(): SimpleAuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a mock context with all required properties if provider is not available
    return {
      user: null,
      session: null,
      loading: false,
      userRole: null,
      userCompanies: [],
      signIn: async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
    };
  }
  return context;
}

export const AuthProvider = AuthContext.Provider;
