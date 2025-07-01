
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PeriodicityType } from "@/types/settings";

export function useRiskBasedPeriodicity(employeeId: string | null) {
  const { data: riskInfo } = useQuery({
    queryKey: ['employee-risk-info', employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      if (!employeeId) return null;
      
      const { data: employee } = await supabase
        .from('employees')
        .select(`
          role_id,
          sector_id,
          roles (
            risk_level
          ),
          sectors (
            risk_level
          )
        `)
        .eq('id', employeeId)
        .single();
        
      return employee;
    }
  });

  const { data: periodicitySettings } = useQuery({
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

  const getPeriodicityByRisk = (): PeriodicityType => {
    if (!riskInfo || !periodicitySettings) return "annual";

    const roleRiskLevel = riskInfo.roles?.risk_level?.toLowerCase();
    const sectorRiskLevel = riskInfo.sectors?.risk_level?.toLowerCase();

    // Priorizar o nível de risco mais alto entre função e setor
    const effectiveRiskLevel = 
      roleRiskLevel === 'high' || sectorRiskLevel === 'high' ? 'high' :
      roleRiskLevel === 'medium' || sectorRiskLevel === 'medium' ? 'medium' :
      roleRiskLevel === 'low' || sectorRiskLevel === 'low' ? 'low' :
      'default';

    switch (effectiveRiskLevel) {
      case 'high':
        return periodicitySettings.risk_high_periodicity as PeriodicityType;
      case 'medium':
        return periodicitySettings.risk_medium_periodicity as PeriodicityType;
      case 'low':
        return periodicitySettings.risk_low_periodicity as PeriodicityType;
      default:
        return periodicitySettings.default_periodicity as PeriodicityType;
    }
  };

  return {
    suggestedPeriodicity: getPeriodicityByRisk(),
    isLoading: !periodicitySettings
  };
}
