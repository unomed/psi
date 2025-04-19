
import { useState } from "react";
import { ScheduledAssessment, RecurrenceType } from "@/types";
import { toast } from "sonner";
import { mockEmployees } from "@/components/assessments/mock/assessmentMockData";
import { saveScheduledAssessment } from "@/services/assessment";
import { useAssessmentCalculations } from "./useAssessmentCalculations";

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
        valid: scheduledDate instanceof Date && !isNaN(scheduledDate.getTime()),
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
    
    // Validação rigorosa da data
    if (!scheduledDate) {
      console.error("Data de agendamento ausente");
      toast.error("Selecione uma data para a avaliação.");
      return null;
    }
    
    // Verificar se a data é válida (não é um objeto Date inválido)
    if (!(scheduledDate instanceof Date) || isNaN(scheduledDate.getTime())) {
      console.error("Data inválida detectada:", scheduledDate, 
        "instanceof Date:", scheduledDate instanceof Date, 
        "isNaN check:", isNaN(scheduledDate instanceof Date ? scheduledDate.getTime() : NaN),
        "Timestamp:", scheduledDate instanceof Date ? scheduledDate.getTime() : "N/A");
      toast.error("A data selecionada é inválida. Por favor, selecione novamente.");
      return null;
    }
    
    try {
      const employee = mockEmployees.find(e => e.id === selectedEmployee);
      if (!employee) {
        toast.error("Funcionário não encontrado.");
        return null;
      }
      
      // Log para periodicidade
      if (recurrenceType === "none") {
        console.log("Avaliação sem recorrência");
      } else {
        console.log(`Recorrência definida como: ${recurrenceType}`);
      }
      
      // Calcular próxima data se houver recorrência
      const nextDate = recurrenceType !== "none" 
        ? calculateNextScheduledDate(scheduledDate, recurrenceType)
        : null;
        
      console.log("Próxima data calculada:", nextDate);
      
      // Criar objeto de avaliação agendada
      const newScheduledAssessment: Omit<ScheduledAssessment, "id"> = {
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate: scheduledDate,
        sentAt: null,
        linkUrl: "",
        status: "scheduled",
        completedAt: null,
        recurrenceType: recurrenceType,
        nextScheduledDate: nextDate,
        phoneNumber: phoneNumber.trim() !== "" ? phoneNumber : undefined
      };
      
      // Salvar no banco de dados
      const savedId = await saveScheduledAssessment(newScheduledAssessment);
      console.log("Avaliação salva com ID:", savedId);
      
      // Atualizar estado local
      const assessmentWithId: ScheduledAssessment = {
        ...newScheduledAssessment,
        id: savedId || `sched-${Date.now()}`
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
