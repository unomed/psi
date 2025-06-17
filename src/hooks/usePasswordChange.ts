
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function usePasswordChange() {
  const [loading, setLoading] = useState(false);

  const changePassword = async (data: PasswordChangeData) => {
    try {
      setLoading(true);

      // Validações básicas
      if (data.newPassword !== data.confirmPassword) {
        toast.error('Nova senha e confirmação não coincidem');
        return false;
      }

      if (data.newPassword.length < 6) {
        toast.error('Nova senha deve ter pelo menos 6 caracteres');
        return false;
      }

      if (data.newPassword === data.currentPassword) {
        toast.error('Nova senha deve ser diferente da senha atual');
        return false;
      }

      // Verificar senha atual através de re-autenticação
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast.error('Usuário não encontrado');
        return false;
      }

      // Tentar fazer login com a senha atual para validar
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });

      if (signInError) {
        toast.error('Senha atual incorreta');
        return false;
      }

      // Atualizar a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (updateError) {
        console.error('Erro ao atualizar senha:', updateError);
        toast.error('Erro ao atualizar senha: ' + updateError.message);
        return false;
      }

      toast.success('Senha alterada com sucesso');
      return true;

    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro inesperado ao alterar senha');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    changePassword,
    loading
  };
}
