
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "./types";

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Get profiles and user roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*, user_roles(role)');

      if (profilesError) {
        toast.error("Erro ao carregar usuários");
        throw profilesError;
      }

      // Use our secure function to get emails
      const userIds = profiles.map(profile => profile.id);
      const { data: emailData, error: emailError } = await supabase
        .rpc('get_user_emails', { user_ids: userIds });

      if (emailError) {
        toast.error("Erro ao carregar emails dos usuários");
        throw emailError;
      }

      // Map the data together
      return profiles.map(profile => {
        const emailInfo = emailData.find(e => e.id === profile.id);
        return {
          id: profile.id,
          full_name: profile.full_name,
          email: emailInfo?.email || '',
          // Fix: Check if user_roles exists and is an array before accessing
          role: Array.isArray(profile.user_roles) && profile.user_roles.length > 0 
            ? profile.user_roles[0].role 
            : 'user',
          is_active: profile.is_active
        } as User;
      });
    }
  });
};
