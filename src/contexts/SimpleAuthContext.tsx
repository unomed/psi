
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppRole } from '@/types';

interface SimpleAuthContextType {
  isAuthenticated: boolean;
  userRole: AppRole;
  userCompanies: Array<{ companyId: string; companyName: string; role: AppRole }>;
  login: (role: AppRole, companies?: Array<{ companyId: string; companyName: string; role: AppRole }>) => void;
  logout: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<AppRole>('user');
  const [userCompanies, setUserCompanies] = useState<Array<{ companyId: string; companyName: string; role: AppRole }>>([]);

  useEffect(() => {
    const savedAuth = localStorage.getItem('simpleAuth');
    if (savedAuth) {
      const { role, companies } = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserRole(role);
      setUserCompanies(companies || []);
    }
  }, []);

  const login = (role: AppRole, companies: Array<{ companyId: string; companyName: string; role: AppRole }> = []) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserCompanies(companies);
    localStorage.setItem('simpleAuth', JSON.stringify({ role, companies }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('user');
    setUserCompanies([]);
    localStorage.removeItem('simpleAuth');
  };

  // Corrigido: Adicionando 'evaluator' que estava faltante
  const roleHierarchy: Record<AppRole, number> = {
    superadmin: 5,
    admin: 4,
    user: 3,
    employee: 2,
    profissionais: 1,
    evaluator: 1 // Adicionado para corrigir o erro
  };

  return (
    <SimpleAuthContext.Provider value={{
      isAuthenticated,
      userRole,
      userCompanies,
      login,
      logout
    }}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}
