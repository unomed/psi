
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useUserRole } from '@/hooks/useUserRole';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { AppRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { session, user, loading: authLoading } = useAuthSession();
  
  // Add safety check before calling useUserRole
  const userRoleHook = React.useMemo(() => {
    try {
      return useUserRole();
    } catch (error) {
      console.error("[AuthProvider] Error initializing useUserRole:", error);
      return {
        userRole: null,
        userCompanies: [],
        roleLoading: false,
        fetchUserRoleAndCompanies: () => Promise.resolve(),
        clearCache: () => {},
      };
    }
  }, []);

  const { userRole, userCompanies, roleLoading, fetchUserRoleAndCompanies, clearCache } = userRoleHook;
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

  // Implementar ações de auth diretamente no contexto para evitar dependência circular
  const signIn = async (email: string, password: string) => {
    try {
      console.log("[AuthProvider] Iniciando processo de login");
      
      // Limpar estado anterior antes de tentar login
      cleanupAuthState();
      
      // Tentar logout global primeiro
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        console.warn("[AuthProvider] Erro ao fazer logout prévio:", signOutError);
        // Continuar mesmo se der erro
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
        console.log("[AuthProvider] Login bem-sucedido, redirecionando...");
        
        // Aguardar um momento para o estado ser atualizado
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
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
        // Use type assertion to match the expected type in the database
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
      
      if (!role) {
        navigate('/auth/login', { replace: true });
      }
      
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
        // Continuar mesmo se der erro
      }
      
      // Forçar redirecionamento e reload completo
      window.location.href = '/auth/login';
    } catch (error: any) {
      console.error("[AuthProvider] Erro completo no logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    }
  };

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
