
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type PeriodicityType = "monthly" | "quarterly" | "semiannual" | "annual";

interface PeriodicitySettings {
  id: string;
  default_periodicity: PeriodicityType;
  risk_high_periodicity: PeriodicityType;
  risk_medium_periodicity: PeriodicityType;
  risk_low_periodicity: PeriodicityType;
}

export interface PeriodicitySettingsForm {
  defaultPeriodicity: PeriodicityType;
  riskHighPeriodicity: PeriodicityType;
  riskMediumPeriodicity: PeriodicityType;
  riskLowPeriodicity: PeriodicityType;
}

export function usePeriodicitySettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['periodicitySettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('periodicity_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching periodicity settings:', error);
        return null;
      }

      return data;
    }
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: async (formValues: PeriodicitySettingsForm) => {
      const newSettings = {
        default_periodicity: formValues.defaultPeriodicity,
        risk_high_periodicity: formValues.riskHighPeriodicity,
        risk_medium_periodicity: formValues.riskMediumPeriodicity,
        risk_low_periodicity: formValues.riskLowPeriodicity
      };

      const { data, error } = await supabase
        .from('periodicity_settings')
        .upsert({
          ...newSettings,
          ...(settings?.id ? { id: settings.id } : {})
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodicitySettings'] });
      toast.success('Configurações de periodicidade atualizadas com sucesso');
    },
    onError: (error) => {
      console.error('Error updating periodicity settings:', error);
      toast.error('Erro ao atualizar as configurações de periodicidade');
    }
  });

  return {
    settings,
    isLoading,
    updateSettings
  };
}
