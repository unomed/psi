
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
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo.");
      return null;
    }
    
    if (!scheduledDate) {
      toast.error("Selecione uma data para a avaliação.");
      return null;
    }
    
    try {
      const employee = mockEmployees.find(e => e.id === selectedEmployee);
      if (!employee) {
        toast.error("Funcionário não encontrado.");
        return null;
      }
      
      const nextDate = calculateNextScheduledDate(scheduledDate, recurrenceType);
      
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
      
      const savedId = await saveScheduledAssessment(newScheduledAssessment);
      
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
