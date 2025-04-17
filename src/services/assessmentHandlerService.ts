
import { toast } from "sonner";
import { ChecklistResult, ChecklistTemplate, ScheduledAssessment, RecurrenceType } from "@/types/checklist";
import { saveScheduledAssessment } from "@/services/checklistService";
import { generateAssessmentLink, getEmployeeInfo } from "@/components/assessments/assessmentUtils";

export const getSelectedEmployeeName = (selectedEmployee: string | null) => {
  return getEmployeeInfo(selectedEmployee).name;
};

export const handleSaveAssessment = async (
  selectedEmployee: string | null,
  selectedTemplate: ChecklistTemplate | null
) => {
  if (!selectedEmployee || !selectedTemplate) {
    toast.error("Selecione um funcionário e um modelo de checklist.");
    return false;
  }

  try {
    await saveScheduledAssessment({
      employeeId: selectedEmployee,
      templateId: selectedTemplate.id,
      scheduledDate: new Date(),
      status: "scheduled",
      sentAt: null,
      completedAt: null,
      linkUrl: "",
      recurrenceType: "none"
    });
    
    toast.success("Avaliação salva com sucesso!");
    return true;
  } catch (error) {
    console.error("Error saving assessment:", error);
    toast.error("Erro ao salvar avaliação.");
    return false;
  }
};

export const calculateNextScheduledDate = (currentDate: Date, recurrenceType: RecurrenceType): Date | null => {
  if (recurrenceType === "none") return null;
  
  const nextDate = new Date(currentDate);
  
  switch (recurrenceType) {
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "semiannual":
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case "annual":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      return null;
  }
  
  return nextDate;
};

export const createAssessmentResult = (
  resultData: Omit<ChecklistResult, "id" | "completedAt">
): ChecklistResult => {
  return {
    ...resultData,
    id: `result-${Date.now()}`,
    completedAt: new Date()
  };
};

export const createGeneratedLink = (
  templateId: string, 
  employeeId: string | null
): string => {
  if (!employeeId) return "";
  return generateAssessmentLink(templateId, employeeId);
};
