
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScheduledAssessment, RecurrenceType } from "@/types";

interface EditAssessmentData {
  id: string;
  scheduledDate: Date;
  recurrenceType: RecurrenceType;
  phoneNumber: string;
}

export function useEditScheduledAssessment() {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const editAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: EditAssessmentData) => {
      const { error } = await supabase
        .from('scheduled_assessments')
        .update({
          scheduled_date: assessmentData.scheduledDate.toISOString(),
          recurrence_type: assessmentData.recurrenceType,
          phone_number: assessmentData.phoneNumber,
          // Reset status to scheduled if it was sent but not completed
          status: 'scheduled'
        })
        .eq('id', assessmentData.id);

      if (error) throw error;
      return assessmentData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledAssessments'] });
      toast.success("Agendamento atualizado com sucesso!");
      setIsEditing(false);
    },
    onError: (error: any) => {
      console.error("Erro ao editar agendamento:", error);
      toast.error("Erro ao editar agendamento");
    }
  });

  const editAssessment = async (data: EditAssessmentData) => {
    return editAssessmentMutation.mutateAsync(data);
  };

  return {
    editAssessment,
    isEditing: editAssessmentMutation.isPending,
    setIsEditing
  };
}
