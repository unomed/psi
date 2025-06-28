import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

// Compatibility hook that maps SimpleAuth to legacy useAuth interface
export function useAuth() {
  const { user, userRole, userCompanies, isLoading, signIn, signOut } = useSimpleAuth();
  
  return {
    user,
    session: user ? { user, isAuthenticated: true } : null,
    loading: isLoading,
    userRole,
    userCompanies,
    signIn,
    signOut,
    // Additional methods for compatibility
    hasRole: (role: string) => userRole === role,
    hasCompanyAccess: (companyId: string) => 
      userRole === 'superadmin' || userCompanies.some(c => c.companyId === companyId)
  };
}

// Keep the provider export for backward compatibility
export const AuthProvider = ({ children }: { children: React.ReactNode }) => children;
