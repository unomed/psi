
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateUserRoleParams } from "./types";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role, companyIds }: UpdateUserRoleParams) => {
      let dbRole: "superadmin" | "admin" | "evaluator";
      
      if (role === 'superadmin' || role === 'admin' || role === 'evaluator') {
        dbRole = role as "superadmin" | "admin" | "evaluator";
      } else {
        dbRole = 'evaluator';
        toast.warning('Função inválida, usando "evaluator" como padrão');
      }
      
      try {
        // First check if the role entry exists
        const { data: existingRole, error: checkError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking user role:', checkError);
          toast.error('Erro ao verificar função do usuário');
          throw checkError;
        }
        
        // Update or insert user role based on whether it exists
        if (existingRole) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ role: dbRole })
            .eq('user_id', userId);
            
          if (roleError) {
            console.error('Error updating user role:', roleError);
            toast.error('Erro ao atualizar função do usuário');
            throw roleError;
          }
        } else {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role: dbRole });
            
          if (roleError) {
            console.error('Error inserting user role:', roleError);
            toast.error('Erro ao definir função do usuário');
            throw roleError;
          }
        }

        // Update user companies if provided
        if (companyIds && companyIds.length > 0) {
          // First delete existing company assignments
          const { error: deleteError } = await supabase
            .from('user_companies')
            .delete()
            .eq('user_id', userId);
            
          if (deleteError) {
            console.error('Error deleting user companies:', deleteError);
            toast.error('Erro ao atualizar empresas do usuário');
            throw deleteError;
          }
          
          // Then insert new company assignments
          const companyAssignments = companyIds.map(companyId => ({
            user_id: userId,
            company_id: companyId
          }));
          
          const { error: insertError } = await supabase
            .from('user_companies')
            .insert(companyAssignments);
            
          if (insertError) {
            console.error('Error inserting user companies:', insertError);
            toast.error('Erro ao associar usuário às empresas');
            throw insertError;
          }
        }
      } catch (error) {
        console.error('Error in updateUserRole mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário atualizado com sucesso');
    }
  });
}
