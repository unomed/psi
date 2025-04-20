import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "superadmin" | "admin" | "evaluator" | "profissionais";
  companies: string[];
}

export function useUsers() {
  const queryClient = useQueryClient();
  const { user: currentUser, userRole } = useAuth();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Fetch all user profiles with emails
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles_with_emails')
        .select('*');

      if (profilesError) {
        toast.error('Erro ao carregar usuários');
        throw profilesError;
      }

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        toast.error('Erro ao carregar funções dos usuários');
        throw rolesError;
      }

      // Fetch user companies
      const { data: userCompanies, error: companiesError } = await supabase
        .from('user_companies')
        .select('user_id, company_id');

      if (companiesError) {
        toast.error('Erro ao carregar empresas dos usuários');
        throw companiesError;
      }

      // Fetch company names
      const { data: companies, error: companyNamesError } = await supabase
        .from('companies')
        .select('id, name');

      if (companyNamesError) {
        toast.error('Erro ao carregar nomes das empresas');
        throw companyNamesError;
      }

      // Combine all user data
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
          full_name: profile.full_name || '', // Assuming we have full_name in profiles_with_emails
          role: userRole?.role || 'evaluator',
          companies: companyNames
        };
      });
    }
  });

  const hasCommonCompany = (array1: string[], array2: string[]): boolean => {
    return array1.some(item => array2.includes(item));
  };

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      // Validate that role is one of the acceptable values
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

  const createUser = useMutation({
    mutationFn: async ({ email, full_name, role }: { email: string; full_name: string; role: string }) => {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name }
      });

      if (error) {
        toast.error('Erro ao criar usuário');
        throw error;
      }

      if (data.user) {
        // Cast the role to the appropriate type based on its value
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
          toast.error('Erro ao definir função do usuário');
          throw roleError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário criado com sucesso');
    }
  });
  
  return {
    users,
    isLoading,
    updateUserRole,
    deleteUser,
    createUser
  };
}
