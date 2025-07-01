
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreateUserParams } from "./types";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, full_name, role, companyIds }: CreateUserParams) => {
      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { full_name }
        });

        if (error) {
          console.error('Error creating user:', error);
          toast.error('Erro ao criar usuário');
          throw error;
        }

        if (data.user) {
          let dbRole: "superadmin" | "admin" | "evaluator";
          
          if (role === 'superadmin' || role === 'admin' || role === 'evaluator') {
            dbRole = role as "superadmin" | "admin" | "evaluator";
          } else {
            dbRole = 'evaluator';
            toast.warning('Função inválida, usando "evaluator" como padrão');
          }
          
          const { error: roleError } = await supabase
            .from('user_roles')
            .upsert({ 
              user_id: data.user.id, 
              role: dbRole 
            });

          if (roleError) {
            console.error('Error setting user role:', roleError);
            toast.error('Erro ao definir função do usuário');
            throw roleError;
          }
          
          // Add company assignments if provided
          if (companyIds && companyIds.length > 0) {
            const companyAssignments = companyIds.map(companyId => ({
              user_id: data.user.id,
              company_id: companyId
            }));
            
            const { error: companiesError } = await supabase
              .from('user_companies')
              .insert(companyAssignments);
              
            if (companiesError) {
              console.error('Error assigning companies to user:', companiesError);
              toast.error('Erro ao associar usuário às empresas');
              throw companiesError;
            }
          }
        }
      } catch (error) {
        console.error('Error in createUser mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário criado com sucesso');
    }
  });
}
