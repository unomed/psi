
import React, { createContext, useContext, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useUserRole } from '@/hooks/useUserRole';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { AppRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

// Função para limpar completamente o estado de autenticação
const cleanupAuthState = () => {
  console.log("[AuthProvider] Limpando estado de autenticação");
  
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log("[AuthProvider] Inicializando AuthProvider");
  
  const { session, user, loading: authLoading } = useAuthSession();
  const { userRole, userCompanies, roleLoading, fetchUserRoleAndCompanies, clearCache } = useUserRole();
  const { hasRole, hasCompanyAccess } = useRolePermissions();

  // Fetch user role when session changes
  React.useEffect(() => {
    if (user?.id) {
      console.log("[AuthProvider] Usuário detectado, buscando role");
      fetchUserRoleAndCompanies(user.id);
    } else {
      console.log("[AuthProvider] Nenhum usuário, limpando cache");
      clearCache();
    }
  }, [user?.id, fetchUserRoleAndCompanies, clearCache]);

  const isLoading = authLoading || roleLoading;

  // Implementar ações de auth
  const signIn = async (email: string, password: string) => {
    try {
      console.log("[AuthProvider] Iniciando processo de login");
      
      // Limpar estado anterior
      cleanupAuthState();
      
      // Tentar logout global primeiro
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        console.warn("[AuthProvider] Erro ao fazer logout prévio:", signOutError);
      }
      
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("[AuthProvider] Erro no login:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("[AuthProvider] Login bem-sucedido");
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!"
        });
      }
      
      return;
    } catch (error: any) {
      console.error("[AuthProvider] Erro completo no login:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role?: AppRole, companyId?: string) => {
    try {
      console.log("[AuthProvider] Iniciando processo de cadastro");
      
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
        console.error("[AuthProvider] Erro no cadastro:", authError);
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
          console.error("[AuthProvider] Erro ao atribuir papel:", roleError);
        }
      }
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "O usuário já pode fazer login com suas credenciais"
      });
      
      return authData.user;
    } catch (error: any) {
      console.error("[AuthProvider] Erro completo no cadastro:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Verifique os dados informados e tente novamente",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("[AuthProvider] Iniciando processo de logout");
      
      // Limpar estado primeiro
      cleanupAuthState();
      
      // Tentar logout no Supabase
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        console.warn("[AuthProvider] Erro no logout do Supabase:", signOutError);
      }
      
      toast({
        title: "Logout realizado com sucesso", 
        description: "Até breve!"
      });
      
      // Forçar redirecionamento
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error: any) {
      console.error("[AuthProvider] Erro completo no logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    }
  };

  // Memoizar o valor do contexto
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
