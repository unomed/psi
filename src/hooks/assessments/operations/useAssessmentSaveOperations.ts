import { toast } from "sonner";
import { ChecklistTemplate } from "@/types";
import { createScheduledAssessment } from "@/services/assessment";

export function useAssessmentSaveOperations({
  setIsScheduleDialogOpen,
  setIsNewAssessmentDialogOpen,
  setActiveTab,
  setScheduledDate
}: {
  setIsScheduleDialogOpen: (isOpen: boolean) => void;
  setIsNewAssessmentDialogOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: string) => void;
  setScheduledDate: (date: Date | undefined) => void;
}) {
  const handleSaveAssessment = async (selectedEmployee: string | null, selectedTemplate: ChecklistTemplate | null) => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return false;
    }

    try {
      await createScheduledAssessment({
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate: new Date(),
      });

      toast.success("Avaliação salva com sucesso!");
      return true;
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast.error("Erro ao salvar avaliação.");
      return false;
    }
  };

  const handleSaveSchedule = async (
    selectedEmployee: string | null,
    selectedTemplate: ChecklistTemplate | null,
    scheduledDate: Date | undefined,
    recurrenceType: string,
    phoneNumber: string
  ) => {
    if (!selectedEmployee || !selectedTemplate || !scheduledDate) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await createScheduledAssessment({
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate,
        recurrenceType: recurrenceType as any,
        phoneNumber: phoneNumber.trim() || undefined
      });

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
    handleSaveAssessment,
    handleSaveSchedule
  };
}
