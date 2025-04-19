
import { ChecklistTemplate } from "@/types";
import { toast } from "sonner";
import { useEmployeeValidation } from "./useEmployeeValidation";
import { useAssessmentRecurrence } from "./useAssessmentRecurrence";
import { useScheduleAssessment } from "./useScheduleAssessment";

export function useAssessmentCreation() {
  const { validateEmployee } = useEmployeeValidation();
  const { calculateRecurrence } = useAssessmentRecurrence();
  const { scheduleAssessment } = useScheduleAssessment();

  const handleSaveAssessment = async (
    selectedEmployee: string | null,
    selectedTemplate: ChecklistTemplate | null,
    scheduledDate: Date | undefined
  ) => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return false;
    }

    if (!scheduledDate) {
      toast.error("Selecione uma data para a avaliação.");
      return false;
    }

    try {
      const employeeData = await validateEmployee(selectedEmployee);
      if (!employeeData) return false;

      const { suggestedRecurrenceType, nextScheduledDate } = await calculateRecurrence(
        selectedEmployee,
        scheduledDate
      );

      const success = await scheduleAssessment(
        selectedEmployee,
        employeeData.name,
        selectedTemplate,
        scheduledDate,
        suggestedRecurrenceType,
        nextScheduledDate
      );

      if (success) {
        console.log("Avaliação agendada com sucesso");
        toast.success("Avaliação agendada com sucesso!");
      }
      
      return success;
    } catch (error) {
      console.error("Erro geral:", error);
      toast.error("Erro ao salvar avaliação.");
      return false;
    }
  };

  return {
    handleSaveAssessment
  };
}
