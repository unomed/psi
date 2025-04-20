
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AppRole } from '@/types';

export function useAuthActions() {
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Explicitly navigate to dashboard after successful login
      navigate('/dashboard');
      return;
    } catch (error: any) {
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
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (authError) {
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
          console.error("Error assigning role:", roleError);
        }
      }
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "O usuário já pode fazer login com suas credenciais"
      });
      
      if (!role) {
        navigate('/auth/login');
      }
      
      return authData.user;
    } catch (error: any) {
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
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    }
  };

  return { signIn, signUp, signOut };
}
