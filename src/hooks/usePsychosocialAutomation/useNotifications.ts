
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PsychosocialNotification } from "./types";

export function useNotifications(companyId?: string | null) {
  return useQuery({
    queryKey: ['psychosocialNotifications', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('psychosocial_notifications')
        .select('*')
        .eq('company_id', companyId!)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data || []) as PsychosocialNotification[];
    },
    enabled: !!companyId
  });
}
