
import { createContext, useContext } from 'react';
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
  const { session, user, loading } = useAuthSession();
  const { userRole, userCompanies, roleLoading, fetchUserRoleAndCompanies } = useUserRole();
  const { signIn, signUp, signOut } = useAuthActions();
  const { hasRole, hasCompanyAccess } = useRolePermissions();

  // Fetch user role when session changes
  React.useEffect(() => {
    if (user) {
      fetchUserRoleAndCompanies(user.id);
    }
  }, [user]);

  const isLoading = loading || roleLoading;

  const value = {
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
  };

  return (
    <AuthContext.Provider value={value}>
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
