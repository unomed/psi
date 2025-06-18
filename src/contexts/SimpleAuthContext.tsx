
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useUserRoleSimple } from '@/hooks/useUserRoleSimple';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { AppRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface SimpleAuthContextType {
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

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

// Função para limpar completamente o estado de autenticação
const cleanupAuthState = () => {
  console.log("[SimpleAuthProvider] Limpando estado de autenticação");
  
  // Limpar localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Limpar sessionStorage
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const { session, user, loading: authLoading } = useAuthSession();
  
  const { 
    userRole, 
    userCompanies, 
    roleLoading, 
    fetchUserRoleAndCompanies, 
    clearCache,
    isInitialized 
  } = useUserRoleSimple();
  
  const { hasRole, hasCompanyAccess } = useRolePermissions();

  // Fetch user role when session changes - with safety checks
  useEffect(() => {
    if (user?.id && isInitialized) {
      const timeoutId = setTimeout(() => {
        fetchUserRoleAndCompanies(user.id);
      }, 100);

      return () => clearTimeout(timeoutId);
    } else if (!user && isInitialized) {
      clearCache();
    }
  }, [user?.id, fetchUserRoleAndCompanies, clearCache, isInitialized]);

  const isLoading = authLoading || roleLoading || !isInitialized;

  // Implementar ações de auth sem dependências de router
  const signIn = async (email: string, password: string) => {
    try {
      console.log("[SimpleAuthProvider] Iniciando processo de login");
      
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        console.warn("[SimpleAuthProvider] Erro ao fazer logout prévio:", signOutError);
      }
      
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("[SimpleAuthProvider] Erro no login:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("[SimpleAuthProvider] Login bem-sucedido, redirecionando...");
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      }
      
      return;
    } catch (error: any) {
      console.error("[SimpleAuthProvider] Erro completo no login:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role?: AppRole, companyId?: string) => {
    try {
      console.log("[SimpleAuthProvider] Iniciando processo de cadastro");
      
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (authError) {
        console.error("[SimpleAuthProvider] Erro no cadastro:", authError);
        throw authError;
      }
      
      if (authData.user && role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: role as "superadmin" | "admin" | "evaluator"
          });
          
        if (roleError) {
          console.error("[SimpleAuthProvider] Erro ao atribuir papel:", roleError);
        }
      }
      
      if (!role) {
        window.location.href = '/auth/login';
      }
      
      return authData.user;
    } catch (error: any) {
      console.error("[SimpleAuthProvider] Erro completo no cadastro:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("[SimpleAuthProvider] Iniciando processo de logout");
      
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        console.warn("[SimpleAuthProvider] Erro no logout do Supabase:", signOutError);
      }
      
      window.location.href = '/auth/login';
    } catch (error: any) {
      console.error("[SimpleAuthProvider] Erro completo no logout:", error);
    }
  };

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
    isLoading,
    userRole,
    userCompanies,
    hasRole,
    hasCompanyAccess,
  ]);

  return (
    <SimpleAuthContext.Provider value={contextValue}>
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
