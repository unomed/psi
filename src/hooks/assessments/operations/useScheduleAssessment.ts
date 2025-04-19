
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChecklistTemplate } from "@/types";

export function useScheduleAssessment() {
  const scheduleAssessment = async (
    selectedEmployee: string,
    employeeName: string,
    selectedTemplate: ChecklistTemplate,
    scheduledDate: Date,
    recurrenceType: string,
    nextScheduledDate: Date | null
  ) => {
    const { error: scheduledError } = await supabase
      .from('scheduled_assessments')
      .insert({
        employee_id: selectedEmployee,
        employee_name: employeeName,
        template_id: selectedTemplate.id,
        scheduled_date: scheduledDate.toISOString(),
        status: 'scheduled',
        recurrence_type: recurrenceType,
        next_scheduled_date: nextScheduledDate?.toISOString()
      });

    if (scheduledError) {
      console.error("Erro ao salvar em scheduled_assessments:", scheduledError);
      toast.error(`Erro ao agendar avaliação: ${scheduledError.message}`);
      return false;
    }

    return true;
  };

  return { scheduleAssessment };
}
