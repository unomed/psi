
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProcessingStats } from "./types";

export function useProcessingStats(companyId?: string | null) {
  return useQuery({
    queryKey: ['psychosocialProcessingStats', companyId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_psychosocial_processing_stats', {
        p_company_id: companyId,
        p_start_date: null,
        p_end_date: null
      });

      if (error) throw error;
      return data[0] as ProcessingStats;
    },
    enabled: !!companyId
  });
}
