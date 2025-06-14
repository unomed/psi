
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
        // Get profiles and user roles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*, user_roles(role)');

        if (profilesError) {
          console.error("Erro ao buscar profiles:", profilesError);
          toast.error("Erro ao carregar usuários");
          throw profilesError;
        }

        console.log("Profiles encontrados:", profiles?.length || 0);

        // Use our secure function to get emails
        const userIds = profiles?.map(profile => profile.id) || [];
        
        if (userIds.length === 0) {
          console.log("Nenhum usuário encontrado");
          return [];
        }

        const { data: emailData, error: emailError } = await supabase
          .rpc('get_user_emails', { user_ids: userIds });

        if (emailError) {
          console.error("Erro ao buscar emails:", emailError);
          toast.error("Erro ao carregar emails dos usuários");
          throw emailError;
        }

        console.log("Emails encontrados:", emailData?.length || 0);

        // Map the data together
        const users = profiles.map(profile => {
          const emailInfo = emailData?.find(e => e.id === profile.id);
          return {
            id: profile.id,
            full_name: profile.full_name || '',
            email: emailInfo?.email || '',
            role: Array.isArray(profile.user_roles) && profile.user_roles.length > 0 
              ? profile.user_roles[0].role 
              : 'evaluator',
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
