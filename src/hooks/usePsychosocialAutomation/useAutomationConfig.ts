
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PsychosocialAutomationConfig } from "./types";

export function useAutomationConfig(companyId?: string | null) {
  return useQuery({
    queryKey: ['psychosocialAutomationConfig', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('psychosocial_automation_config')
        .select('*')
        .eq('company_id', companyId!)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as PsychosocialAutomationConfig | null;
    },
    enabled: !!companyId
  });
}
