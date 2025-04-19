
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        .select(`
          user_id,
          companies (
            name
          )
        `);

      if (companiesError) {
        toast.error('Erro ao carregar empresas dos usuários');
        throw companiesError;
      }

      return profiles.map(profile => {
        const userRole = userRoles.find(r => r.user_id === profile.id);
        const companies = userCompanies
          .filter(uc => uc.user_id === profile.id)
          .map(uc => uc.companies?.name)
          .filter(Boolean);

        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: userRole?.role || 'user',
          companies
        };
      }) as User[];
    }
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role });

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
