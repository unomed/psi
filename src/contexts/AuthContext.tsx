
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { AppRole } from '@/types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role?: AppRole, companyId?: string) => Promise<User | undefined>;
  signOut: () => Promise<void>;
  loading: boolean;
  userRole: string | null;
  userCompanies: { companyId: string; companyName: string; }[];
  hasRole: (role: AppRole) => Promise<boolean>;
  hasCompanyAccess: (companyId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, user, loading: authLoading } = useAuthSession();
  const { userRole, userCompanies, roleLoading, fetchUserRoleAndCompanies, clearCache } = useUserRole();
  const { signIn, signUp, signOut } = useAuthActions();
  const { hasRole, hasCompanyAccess } = useRolePermissions();

  // Fetch user role when session changes - com debounce
  useEffect(() => {
    if (user?.id) {
      // Debounce para evitar chamadas múltiplas
      const timeoutId = setTimeout(() => {
        fetchUserRoleAndCompanies(user.id);
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
      // Limpar cache quando usuário sai
      clearCache();
    }
  }, [user?.id, fetchUserRoleAndCompanies, clearCache]);

  const isLoading = authLoading || roleLoading;

  // Memoizar o valor do contexto para evitar re-renders desnecessários
  const contextValue = useMemo(() => ({
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading: isLoading,
    userRole,
    userCompanies,
    hasRole,
    hasCompanyAccess,
  }), [
    session,
    user,
    signIn,
    signUp,
    signOut,
    isLoading,
    userRole,
    userCompanies,
    hasRole,
    hasCompanyAccess,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
