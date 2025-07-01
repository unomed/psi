
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export async function getPeriodicitySettings() {
  const { data, error } = await supabase
    .from('periodicity_settings')
    .select('*')
    .single();
    
  if (error) throw error;
  return data;
}

export function usePeriodicityForRisk(riskLevel: string | null) {
  const { data: settings } = useQuery({
    queryKey: ['periodicitySettings'],
    queryFn: getPeriodicitySettings
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

export function getPeriodicityForRiskLevel(riskLevel: string | null, settings: any) {
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
