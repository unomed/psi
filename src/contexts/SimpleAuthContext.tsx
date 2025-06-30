
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Import AppRole from types
import { AppRole } from '@/types';

interface SimpleAuthContextType {
  isAuthenticated: boolean;
  userRole: AppRole;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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
  const [userRole, setUserRole] = useState<AppRole>('profissionais' as AppRole); // CORRIGIDO

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de login simples
    if (email && password) {
      setIsAuthenticated(true);
      setUserRole('admin' as AppRole); // CORRIGIDO - usar role válido
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('profissionais' as AppRole); // CORRIGIDO
  };

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
      login,
      logout,
      hasPermission
    }}>
      {children}
    </SimpleAuthContext.Provider>
  );
};
