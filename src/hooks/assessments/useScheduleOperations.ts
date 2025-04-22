
import { toast } from "sonner";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { calculateNextScheduledDate as calcNextDate } from "@/services/assessmentHandlerService";
import { mockEmployees } from "@/components/assessments/mock/assessmentMockData";
import { saveScheduledAssessment } from "@/services/checklist";
import { validateAssessmentDate } from "@/utils/dateUtils";

export function useScheduleOperations({
  selectedEmployee,
  selectedTemplate,
  scheduledDate,
  setIsScheduleDialogOpen,
  setIsNewAssessmentDialogOpen,
  setScheduledDate,
  setActiveTab
}: {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  scheduledDate: Date | undefined;
  setIsScheduleDialogOpen: (isOpen: boolean) => void;
  setIsNewAssessmentDialogOpen: (isOpen: boolean) => void;
  setScheduledDate: (date: Date | undefined) => void;
  setActiveTab: (tab: string) => void;
}) {
  const handleScheduleAssessment = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist para agendar a avaliação.");
      return;
    }
    
    setIsScheduleDialogOpen(true);
  };

  const handleSaveSchedule = async (recurrenceType: RecurrenceType, phoneNumber: string) => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    
    // Using our date validation utility
    const dateError = validateAssessmentDate(scheduledDate);
    if (dateError) {
      toast.error(dateError);
      return;
    }
    
    try {
      const employee = mockEmployees.find(e => e.id === selectedEmployee);
      if (!employee) {
        toast.error("Funcionário não encontrado.");
        return;
      }
      
      const nextDate = calcNextDate(scheduledDate!, recurrenceType);
      
      const newScheduledAssessment = {
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate: scheduledDate!,
        sentAt: null,
        linkUrl: "",
        status: "scheduled" as const,
        completedAt: null,
        recurrenceType: recurrenceType,
        nextScheduledDate: nextDate,
        phoneNumber: phoneNumber.trim() !== "" ? phoneNumber : undefined
      };
      
      await saveScheduledAssessment(newScheduledAssessment);
      
      setIsScheduleDialogOpen(false);
      setIsNewAssessmentDialogOpen(false);
      setScheduledDate(undefined);
      setActiveTab("agendadas");
      toast.success("Avaliação agendada com sucesso!");
    } catch (error) {
      console.error("Erro ao agendar avaliação:", error);
      toast.error("Erro ao agendar avaliação. Tente novamente mais tarde.");
    }
  };

  return {
    handleScheduleAssessment,
    handleSaveSchedule
  };
}
