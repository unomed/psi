
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SimpleAuthContextType {
  isAuthenticated: boolean;
  userRole: AppRole;
  userCompanies: Array<{ companyId: string; companyName: string; role: AppRole }>;
  user: any;
  isLoading: boolean;
  login: (role: AppRole, companies?: Array<{ companyId: string; companyName: string; role: AppRole }>) => void;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<AppRole>('user');
  const [userCompanies, setUserCompanies] = useState<Array<{ companyId: string; companyName: string; role: AppRole }>>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem('simpleAuth');
    if (savedAuth) {
      const { role, companies, user } = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserRole(role);
      setUserCompanies(companies || []);
      setUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = (role: AppRole, companies: Array<{ companyId: string; companyName: string; role: AppRole }> = []) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserCompanies(companies);
    const userData = { id: 'simple-user', email: 'user@example.com', role };
    setUser(userData);
    localStorage.setItem('simpleAuth', JSON.stringify({ role, companies, user: userData }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('user');
    setUserCompanies([]);
    setUser(null);
    localStorage.removeItem('simpleAuth');
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        setUserRole('admin');
        localStorage.setItem('simpleAuth', JSON.stringify({ 
          role: 'admin', 
          companies: [], 
          user: data.user 
        }));
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      logout();
    } catch (error) {
      console.error('Erro no logout:', error);
      logout();
    }
  };

  const roleHierarchy: Record<AppRole, number> = {
    superadmin: 5,
    admin: 4,
    user: 3,
    employee: 2,
    profissionais: 1,
    evaluator: 1
  };

  return (
    <SimpleAuthContext.Provider value={{
      isAuthenticated,
      userRole,
      userCompanies,
      user,
      isLoading,
      login,
      logout,
      signIn,
      signOut
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
