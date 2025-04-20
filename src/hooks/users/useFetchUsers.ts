
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, ProfileWithEmail } from "./types";

export function useFetchUsers() {
  return useQuery({
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
}
