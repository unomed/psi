
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Import AppRole from types
import { AppRole } from '@/types';

interface SimpleAuthContextType {
  isAuthenticated: boolean;
  userRole: AppRole;
  user: any;
  isLoading: boolean;
  userCompanies: { companyId: string; companyName: string; }[];
  login: (email: string, password: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signOut: () => void;
  hasPermission: (requiredRole: AppRole) => boolean;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
};

interface SimpleAuthProviderProps {
  children: ReactNode;
}

export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<AppRole>('profissionais' as AppRole);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userCompanies] = useState<{ companyId: string; companyName: string; }[]>([
    { companyId: '1', companyName: 'Empresa Teste' }
  ]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulação de login simples
      if (email && password) {
        setIsAuthenticated(true);
        setUserRole('admin' as AppRole);
        setUser({ email, id: '1' });
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = login; // Alias for compatibility

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('profissionais' as AppRole);
    setUser(null);
  };

  const signOut = logout; // Alias for compatibility

  const hasPermission = (requiredRole: AppRole): boolean => {
    const roleHierarchy: Record<AppRole, number> = {
      'profissionais': 1,
      'evaluator': 2,
      'admin': 3,
      'superadmin': 4,
      'user': 1
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  };

  return (
    <SimpleAuthContext.Provider value={{
      isAuthenticated,
      userRole,
      user,
      isLoading,
      userCompanies,
      login,
      signIn,
      logout,
      signOut,
      hasPermission
    }}>
      {children}
    </SimpleAuthContext.Provider>
  );
};
