
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
    // Obter ID da empresa do funcionário selecionado
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('company_id')
      .eq('id', selectedEmployee)
      .single();
      
    if (employeeError) {
      console.error("Erro ao buscar dados do funcionário:", employeeError);
      toast.error(`Erro ao buscar dados do funcionário: ${employeeError.message}`);
      return false;
    }
    
    // Agendar a avaliação
    const { error: scheduledError } = await supabase
      .from('scheduled_assessments')
      .insert({
        employee_id: selectedEmployee,
        employee_name: employeeName,
        template_id: selectedTemplate.id,
        scheduled_date: scheduledDate.toISOString(),
        status: 'scheduled',
        recurrence_type: recurrenceType,
        next_scheduled_date: nextScheduledDate?.toISOString(),
        company_id: employeeData.company_id // Armazenar o ID da empresa diretamente
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
