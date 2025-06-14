
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      console.log("Desativando usuário:", userId);
      
      // Usar soft delete - apenas desativar o usuário
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao desativar usuário:', error);
        toast.error('Erro ao desativar usuário');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário desativado com sucesso');
    },
    onError: (error) => {
      console.error('Erro na mutação de delete:', error);
      toast.error('Erro ao desativar usuário');
    }
  });
}
