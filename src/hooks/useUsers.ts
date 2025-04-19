import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AppRole } from "@/types";

interface User {
  id: string;
  email: string;
  role: string;
  companies: string[];
  full_name: string;
}

export function useUsers() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles_with_emails')
        .select('*');

      if (profilesError) {
        toast.error('Erro ao carregar usuários');
        throw profilesError;
      }

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        toast.error('Erro ao carregar funções dos usuários');
        throw rolesError;
      }

      const { data: userCompanies, error: companiesError } = await supabase
        .from('user_companies')
        .select('user_id, company_id');

      if (companiesError) {
        toast.error('Erro ao carregar empresas dos usuários');
        throw companiesError;
      }

      const { data: companies, error: companyNamesError } = await supabase
        .from('companies')
        .select('id, name');

      if (companyNamesError) {
        toast.error('Erro ao carregar nomes das empresas');
        throw companyNamesError;
      }

      return profiles.map(profile => {
        const userRole = userRoles.find(r => r.user_id === profile.id);
        
        const userCompanyIds = userCompanies
          .filter(uc => uc.user_id === profile.id)
          .map(uc => uc.company_id);
        
        const companyNames = companies
          .filter(c => userCompanyIds.includes(c.id))
          .map(c => c.name);

        return {
          id: profile.id,
          email: profile.email || '',
          full_name: (profile as any).full_name || '',
          role: userRole?.role || 'user',
          companies: companyNames
        };
      }) as User[];
    }
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      let dbRole: "superadmin" | "admin" | "evaluator";
      
      if (role === 'superadmin' || role === 'admin' || role === 'evaluator') {
        dbRole = role as "superadmin" | "admin" | "evaluator";
      } else {
        dbRole = 'evaluator';
        toast.warning('Função inválida, usando "evaluator" como padrão');
      }
      
      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: dbRole 
        });

      if (error) {
        toast.error('Erro ao atualizar função do usuário');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Função do usuário atualizada com sucesso');
    }
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        toast.error('Erro ao excluir usuário');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário excluído com sucesso');
    }
  });

  return {
    users,
    isLoading,
    updateUserRole,
    deleteUser
  };
}
