
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type AssessmentCriteriaSettings = {
  id: string;
  default_recurrence_type: "none" | "monthly" | "semiannual" | "annual";
  medium_risk_threshold: number;
  require_reassessment_for_high_risk: boolean;
  reassessment_max_days: number;
  notify_managers_on_high_risk: boolean;
  sector_risk_calculation_type: "average" | "highest" | "weighted";
  company_risk_calculation_type: "average" | "highest" | "weighted";
  enable_recurrence_reminders: boolean;
  days_before_reminder_sent: number;
  minimum_employee_percentage: number;
  require_all_sectors: boolean;
  require_all_roles: boolean;
  prioritize_high_risk_roles: boolean;
  low_risk_threshold: number;
};

export function useAssessmentCriteriaSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["assessment-criteria-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessment_criteria_settings")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching assessment criteria settings:", error);
        throw error;
      }

      return data as AssessmentCriteriaSettings;
    }
  });

  const { mutateAsync: updateSettings } = useMutation({
    mutationFn: async (newSettings: Partial<AssessmentCriteriaSettings>) => {
      const { error } = await supabase
        .from("assessment_criteria_settings")
        .update(newSettings)
        .eq("id", settings?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-criteria-settings"] });
      toast.success("Configurações atualizadas com sucesso");
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast.error("Erro ao atualizar configurações");
    }
  });

  return {
    settings,
    isLoading,
    updateSettings
  };
}
