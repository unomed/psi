
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "./types";

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Iniciando busca de usuários...");
      
      try {
        // First, get all active profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_active', true); // Filtrar apenas usuários ativos

        if (profilesError) {
          console.error("Erro ao buscar profiles:", profilesError);
          toast.error("Erro ao carregar usuários");
          throw profilesError;
        }

        if (!profiles || profiles.length === 0) {
          console.log("Nenhum profile ativo encontrado");
          return [];
        }

        console.log("Profiles ativos encontrados:", profiles.length);

        // Get user IDs for email lookup
        const userIds = profiles.map(profile => profile.id);

        // Get user emails using the secure function
        const emailPromises = userIds.map(async (userId) => {
          const { data, error } = await supabase.rpc('get_user_emails', { p_user_id: userId });
          if (error) return null;
          return { id: userId, email: data?.[0]?.email || '' };
        });
        const emailData = await Promise.all(emailPromises);

        const validEmailData = emailData.filter(item => item !== null);

        console.log("Emails encontrados:", validEmailData?.length || 0);

        // Get user roles separately
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        if (rolesError) {
          console.error("Erro ao buscar roles:", rolesError);
          toast.error("Erro ao carregar perfis dos usuários");
          throw rolesError;
        }

        console.log("Roles encontrados:", userRoles?.length || 0);

        // Combine the data
        const users = profiles.map(profile => {
          const emailInfo = validEmailData?.find(e => e?.id === profile.id);
          const roleInfo = userRoles?.find(r => r.user_id === profile.id);
          
          return {
            id: profile.id,
            full_name: profile.full_name || '',
            email: emailInfo?.email || '',
            role: roleInfo?.role || 'evaluator',
            is_active: profile.is_active,
            companies: [] // This will be populated separately if needed
          } as User;
        });

        console.log("Usuários processados:", users.length);
        return users;
      } catch (error) {
        console.error("Erro na busca de usuários:", error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
