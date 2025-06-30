
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScheduledAssessment, RecurrenceType } from "@/types";

interface SaveAssessmentData {
  employeeId: string;
  templateId: string;
  scheduledDate: Date;
  recurrenceType: RecurrenceType;
  phoneNumber: string;
  companyId?: string;
}

export function useAssessmentSaveOperations() {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const saveAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: SaveAssessmentData) => {
      const linkUrl = `${window.location.origin}/assessment/${Math.random().toString(36).substr(2, 9)}`;
      
      // Calculate next scheduled date based on recurrence
      let nextScheduledDate = null;
      if (assessmentData.recurrenceType !== "none") {
        const nextDate = new Date(assessmentData.scheduledDate);
        switch (assessmentData.recurrenceType) {
          case "monthly":
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
          case "semiannual":
            nextDate.setMonth(nextDate.getMonth() + 6);
            break;
          case "annual":
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        }
        nextScheduledDate = nextDate;
      }

      const { error } = await supabase
        .from('scheduled_assessments')
        .insert({
          employee_id: assessmentData.employeeId,
          template_id: assessmentData.templateId,
          scheduled_date: assessmentData.scheduledDate.toISOString(),
          recurrence_type: assessmentData.recurrenceType, // Use snake_case for database
          next_scheduled_date: nextScheduledDate?.toISOString(),
          phone_number: assessmentData.phoneNumber,
          link_url: linkUrl,
          status: 'scheduled',
          company_id: assessmentData.companyId
        });

      if (error) throw error;
      return linkUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledAssessments'] });
      toast.success("Avaliação agendada com sucesso!");
      setIsSaving(false);
    },
    onError: (error: any) => {
      console.error("Erro ao agendar avaliação:", error);
      toast.error("Erro ao agendar avaliação");
    }
  });

  const saveAssessment = async (data: SaveAssessmentData) => {
    return saveAssessmentMutation.mutateAsync(data);
  };

  return {
    saveAssessment,
    isSaving: saveAssessmentMutation.isPending,
    setIsSaving
  };
}
