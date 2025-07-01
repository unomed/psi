
import { ScheduledAssessment, ChecklistTemplate, RecurrenceType } from "@/types";
import { toast } from "sonner";

export function useAssessmentScheduling() {
  const handleScheduleNewAssessment = (
    setSelectedEmployee: (employee: string) => void,
    setSelectedTemplate: (template: ChecklistTemplate) => void,
    setIsScheduleDialogOpen: (isOpen: boolean) => void,
    employeeId: string,
    templateId: string
  ) => {
    setSelectedEmployee(employeeId);
    setSelectedTemplate({ id: templateId } as ChecklistTemplate);
    setIsScheduleDialogOpen(true);
  };

  const handleStartAssessment = (
    selectedEmployee: string | null,
    selectedTemplate: ChecklistTemplate | null,
    setIsAssessmentDialogOpen: (isOpen: boolean) => void
  ) => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return;
    }
    
    setIsAssessmentDialogOpen(true);
  };

  return {
    handleScheduleNewAssessment,
    handleStartAssessment
  };
}
