
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProcessingLog } from "./types";

export function useProcessingLogs(companyId?: string | null) {
  return useQuery({
    queryKey: ['psychosocialProcessingLogs', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('psychosocial_processing_logs')
        .select('*')
        .eq('company_id', companyId!)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []) as ProcessingLog[];
    },
    enabled: !!companyId
  });
}
