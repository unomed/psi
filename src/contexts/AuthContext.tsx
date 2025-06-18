
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/types/auth';

// Interface completa do contexto de autenticação
interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: AppRole | null;
  userCompanies: Array<{ companyId: string; companyName: string }>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  hasCompanyAccess: (companyId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log("[AuthProvider] Inicializando contexto completo");
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [userCompanies, setUserCompanies] = useState<Array<{ companyId: string; companyName: string }>>([]);

  // Simular dados do usuário para desenvolvimento
  useEffect(() => {
    console.log('[AuthProvider] Simulando autenticação para desenvolvimento...');
    
    setTimeout(() => {
      // Simular usuário logado para desenvolvimento
      const mockUser = {
        id: 'mock-user-id',
        email: 'admin@test.com',
        user_metadata: { full_name: 'Admin Test' }
      } as User;
      
      setUser(mockUser);
      setUserRole('admin');
      setUserCompanies([
        { companyId: '1', companyName: 'Empresa Teste 1' },
        { companyId: '2', companyName: 'Empresa Teste 2' }
      ]);
      setLoading(false);
    }, 100);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    loading,
    userRole,
    userCompanies,
    signIn: async (email: string, password: string) => {
      console.log('[AuthProvider] SignIn simulado', { email });
      // Implementação real viria aqui
    },
    signUp: async (email: string, password: string) => {
      console.log('[AuthProvider] SignUp simulado', { email });
      // Implementação real viria aqui
    },
    signOut: async () => {
      console.log('[AuthProvider] SignOut simulado');
      setUser(null);
      setUserRole(null);
      setUserCompanies([]);
    },
    hasRole: (role: AppRole) => {
      return userRole === role || userRole === 'superadmin';
    },
    hasCompanyAccess: (companyId: string) => {
      return userRole === 'superadmin' || 
             userCompanies.some(company => company.companyId === companyId);
    },
  }), [user, loading, userRole, userCompanies]);

  console.log("[AuthProvider] Renderizando com contexto completo...");
  
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
