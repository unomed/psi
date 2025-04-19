
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePeriodicityForRisk(riskLevel: string | null) {
  const { data: settings } = useQuery({
    queryKey: ['periodicitySettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('periodicity_settings')
        .select('*')
        .single();
        
      if (error) throw error;
      return data;
    }
  });

  if (!settings || !riskLevel) return 'none';

  switch (riskLevel.toLowerCase()) {
    case 'high':
      return settings.risk_high_periodicity;
    case 'medium':
      return settings.risk_medium_periodicity;
    case 'low':
      return settings.risk_low_periodicity;
    default:
      return settings.default_periodicity;
  }
}
