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

interface ProfileWithEmail {
  id: string;
  email?: string;
  full_name?: string;
}

export function useUsers() {
  const queryClient = useQueryClient();
  const { user: currentUser, userRole } = useAuth();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        // Fetch user emails and metadata from auth.users via profiles_with_emails view
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles_with_emails')
          .select('*');

        if (profilesError) {
          toast.error('Erro ao carregar usuários');
          throw profilesError;
        }

        // Fetch user display names (full_name) from profiles table
        const { data: userProfiles, error: profileNamesError } = await supabase
          .from('profiles')
          .select('id, full_name');

        if (profileNamesError) {
          toast.error('Erro ao carregar nomes dos usuários');
          throw profileNamesError;
        }

        // Create a map of profile IDs to full names for easy lookup
        const profileNamesMap = new Map();
        if (userProfiles) {
          userProfiles.forEach((profile: any) => {
            profileNamesMap.set(profile.id, profile.full_name);
          });
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

        return profiles.map((profile: ProfileWithEmail) => {
          const userRole = userRoles.find(r => r.user_id === profile.id);
          const userCompanyIds = userCompanies
            .filter(uc => uc.user_id === profile.id)
            .map(uc => uc.company_id);

          const companyNames = companies
            .filter(c => userCompanyIds.includes(c.id))
            .map(c => c.name);

          // Get full_name from the profiles table if available, otherwise use from profiles_with_emails
          // or default to empty string if neither is available
          const fullName = profileNamesMap.get(profile.id) || profile.full_name || '';

          return {
            id: profile.id,
            email: profile.email || '',
            full_name: fullName,
            role: userRole?.role || 'evaluator',
            companies: companyNames
          };
        });
      } catch (error) {
        console.error('Error fetching users data:', error);
        toast.error('Erro ao carregar dados dos usuários');
        throw error;
      }
    }
  });

  const hasCommonCompany = (array1: string[], array2: string[]): boolean => {
    return array1.some(item => array2.includes(item));
  };

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role, companyIds }: { userId: string, role: string, companyIds?: string[] }) => {
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
          // PGRST116 means "no rows returned" which is fine - we'll create one
          console.error('Error checking user role:', checkError);
          toast.error('Erro ao verificar função do usuário');
          throw checkError;
        }
        
        // Update or insert user role based on whether it exists
        if (existingRole) {
          // Update existing role
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
          // Insert new role
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
    mutationFn: async ({ email, full_name, role, companyIds }: 
      { email: string; full_name: string; role: string; companyIds?: string[] }) => {
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
  
  return {
    users,
    isLoading,
    updateUserRole,
    deleteUser,
    createUser
  };
}
