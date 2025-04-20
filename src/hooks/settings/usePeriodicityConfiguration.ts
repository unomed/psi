
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type PeriodicityType = "monthly" | "quarterly" | "semiannual" | "annual";

interface PeriodicitySettings {
  default_periodicity: PeriodicityType;
  risk_high_periodicity: PeriodicityType;
  risk_medium_periodicity: PeriodicityType;
  risk_low_periodicity: PeriodicityType;
}

export function usePeriodicityConfiguration() {
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

  const updateSettings = useMutation({
    mutationFn: async (newSettings: PeriodicitySettings) => {
      const { error } = await supabase
        .from('periodicity_settings')
        .upsert({
          ...newSettings,
          ...(settings?.id ? { id: settings.id } : {})
        });

      if (error) throw error;
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
    updateSettings: updateSettings.mutate
  };
}
