
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Hook simplificado que apenas expõe as ações do contexto
export function useAuthActions() {
  const { signIn, signOut } = useAuth();
  
  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) throw error;
      toast.success('Cadastro realizado com sucesso! Verifique seu email.');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro no cadastro: ' + error.message);
      throw error;
    }
  };
  
  return { signIn, signUp, signOut };
}
