
import { useState } from "react";
import { ScheduledAssessment, RecurrenceType } from "@/types";
import { toast } from "sonner";
import { saveScheduledAssessment } from "@/services/checklist";
import { useAssessmentCalculations } from "./useAssessmentCalculations";
import { isValidDate, validateAssessmentDate } from "@/utils/dateUtils";
import { supabase } from "@/integrations/supabase/client";

export function useAssessmentSaveOperations() {
  const [scheduledAssessments, setScheduledAssessments] = useState<ScheduledAssessment[]>([]);
  const { calculateNextScheduledDate } = useAssessmentCalculations();

  const handleSaveSchedule = async (
    selectedEmployee: string | null,
    selectedTemplate: any | null,
    scheduledDate: Date | undefined,
    recurrenceType: RecurrenceType,
    phoneNumber: string = ""
  ) => {
    // Validação detalhada com log
    console.log("Salvando agendamento:", {
      selectedEmployee,
      templateId: selectedTemplate?.id,
      scheduledDate: scheduledDate ? {
        date: scheduledDate.toISOString(),
        valid: isValidDate(scheduledDate),
        toString: String(scheduledDate),
        typeof: typeof scheduledDate,
        timestamp: scheduledDate.getTime()
      } : 'undefined',
      recurrenceType
    });
    
    // Validação básica de parâmetros
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo.");
      return null;
    }
    
    // Using our date validation utility
    const dateError = validateAssessmentDate(scheduledDate);
    if (dateError) {
      toast.error(dateError);
      return null;
    }
    
    try {
      // Buscar dados do funcionário do banco de dados
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('name, company_id')
        .eq('id', selectedEmployee)
        .single();
        
      if (employeeError) {
        console.error("Erro ao buscar dados do funcionário:", employeeError);
        toast.error("Funcionário não encontrado no banco de dados.");
        return null;
      }
      
      // Calcular próxima data se houver recorrência
      const nextDate = recurrenceType !== "none" 
        ? calculateNextScheduledDate(scheduledDate!, recurrenceType)
        : null;
        
      console.log("Próxima data calculada:", nextDate);
      
      // Criar objeto de avaliação agendada com campos corretos
      const newScheduledAssessment: Omit<ScheduledAssessment, "id"> = {
        company_id: employeeData.company_id,
        checklist_template_id: selectedTemplate.id,
        employee_ids: [selectedEmployee],
        scheduled_date: scheduledDate!.toISOString(),
        status: "scheduled",
        recurrence_type: recurrenceType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Campos de compatibilidade legacy
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate: scheduledDate!,
        sentAt: null,
        linkUrl: "",
        completedAt: null,
        nextScheduledDate: nextDate,
        phoneNumber: phoneNumber.trim() !== "" ? phoneNumber : undefined,
        employee_name: employeeData.name
      };
      
      // Salvar no banco de dados
      const savedId = await saveScheduledAssessment(newScheduledAssessment);
      console.log("Avaliação salva com ID:", savedId);
      
      // Atualizar estado local
      const assessmentWithId: ScheduledAssessment = {
        ...newScheduledAssessment,
        id: savedId
      };
      
      setScheduledAssessments([...scheduledAssessments, assessmentWithId]);
      toast.success("Avaliação agendada com sucesso!");
      return assessmentWithId;
    } catch (error) {
      console.error("Erro ao agendar avaliação:", error);
      toast.error("Erro ao agendar avaliação. Tente novamente mais tarde.");
      return null;
    }
  };

  return {
    scheduledAssessments,
    setScheduledAssessments,
    handleSaveSchedule
  };
}
