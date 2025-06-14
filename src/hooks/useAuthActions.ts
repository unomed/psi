
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AppRole } from '@/types';

// Função para limpar completamente o estado de autenticação
const cleanupAuthState = () => {
  console.log("[useAuthActions] Limpando estado de autenticação");
  
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

export function useAuthActions() {
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      console.log("[useAuthActions] Iniciando processo de login");
      
      // Limpar estado anterior antes de tentar login
      cleanupAuthState();
      
      // Tentar logout global primeiro
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        console.warn("[useAuthActions] Erro ao fazer logout prévio:", signOutError);
        // Continuar mesmo se der erro
      }
      
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("[useAuthActions] Erro no login:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("[useAuthActions] Login bem-sucedido, redirecionando");
        // Usar replace para evitar histórico de navegação problemático
        navigate('/dashboard', { replace: true });
      }
      
      return;
    } catch (error: any) {
      console.error("[useAuthActions] Erro completo no login:", error);
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
      console.log("[useAuthActions] Iniciando processo de cadastro");
      
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
        console.error("[useAuthActions] Erro no cadastro:", authError);
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
          console.error("[useAuthActions] Erro ao atribuir papel:", roleError);
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
      console.error("[useAuthActions] Erro completo no cadastro:", error);
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
      console.log("[useAuthActions] Iniciando processo de logout");
      
      // Limpar estado primeiro
      cleanupAuthState();
      
      // Tentar logout no Supabase
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        console.warn("[useAuthActions] Erro no logout do Supabase:", signOutError);
        // Continuar mesmo se der erro
      }
      
      // Forçar redirecionamento e reload completo
      window.location.href = '/auth/login';
    } catch (error: any) {
      console.error("[useAuthActions] Erro completo no logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    }
  };

  return { signIn, signUp, signOut };
}
