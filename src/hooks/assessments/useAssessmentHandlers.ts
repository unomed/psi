
import { useBasicAssessmentActions } from "./useBasicAssessmentActions";
import { useLinkOperations } from "./useLinkOperations";
import { useScheduleOperations } from "./useScheduleOperations";
import { ScheduledAssessment, ChecklistTemplate, ChecklistResult } from "@/types";
import { createAssessmentResult, getSelectedEmployeeName as getEmployeeName } from "@/services/assessmentHandlerService";
import { toast } from "sonner";
import { handleSaveAssessment as saveAssessment } from "@/services/assessmentHandlerService";

export function useAssessmentHandlers({
  selectedEmployee,
  selectedTemplate,
  setSelectedEmployee,
  setSelectedTemplate,
  setIsAssessmentDialogOpen,
  setIsResultDialogOpen,
  setIsScheduleDialogOpen,
  setIsLinkDialogOpen,
  setIsShareDialogOpen,
  setIsNewAssessmentDialogOpen,
  setAssessmentResult,
  setGeneratedLink,
  setActiveTab,
  scheduledDate,
  setScheduledDate,
  setSelectedAssessment,
  handleSendEmail
}: {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  setSelectedEmployee: (employee: string | null) => void;
  setSelectedTemplate: (template: ChecklistTemplate | null) => void;
  setIsAssessmentDialogOpen: (isOpen: boolean) => void;
  setIsResultDialogOpen: (isOpen: boolean) => void;
  setIsScheduleDialogOpen: (isOpen: boolean) => void;
  setIsLinkDialogOpen: (isOpen: boolean) => void;
  setIsShareDialogOpen: (isOpen: boolean) => void;
  setIsNewAssessmentDialogOpen: (isOpen: boolean) => void;
  setAssessmentResult: (result: any) => void;
  setGeneratedLink: (link: string) => void;
  setActiveTab: (tab: string) => void;
  scheduledDate: Date | undefined;
  setScheduledDate: (date: Date | undefined) => void;
  setSelectedAssessment: (assessment: ScheduledAssessment | null) => void;
  handleSendEmail: (employeeId: string) => void;
}) {
  const basicActions = useBasicAssessmentActions({
    setSelectedEmployee,
    setSelectedTemplate,
    setIsNewAssessmentDialogOpen,
    setActiveTab
  });

  const linkOperations = useLinkOperations({
    selectedEmployee,
    selectedTemplate,
    setGeneratedLink,
    setIsLinkDialogOpen
  });

  const scheduleOperations = useScheduleOperations({
    selectedEmployee,
    selectedTemplate,
    scheduledDate,
    setIsScheduleDialogOpen,
    setIsNewAssessmentDialogOpen,
    setScheduledDate,
    setActiveTab
  });

  const handleShareAssessment = (assessmentId: string) => {
    const assessment = { id: assessmentId } as ScheduledAssessment; // Simplified for example
    setSelectedAssessment(assessment);
    setIsShareDialogOpen(true);
  };

  const handleCloseResult = () => {
    setIsResultDialogOpen(false);
    setAssessmentResult(null);
  };

  // Add the missing functions
  const handleSaveAssessment = async () => {
    return await saveAssessment(selectedEmployee, selectedTemplate);
  };

  const handleSubmitAssessment = (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
    try {
      const result = createAssessmentResult(resultData);
      setAssessmentResult(result);
      setIsAssessmentDialogOpen(false);
      setIsResultDialogOpen(true);
      return result;
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Erro ao enviar avaliação.");
      return null;
    }
  };

  const getSelectedEmployeeName = (employeeId: string | null) => {
    return getEmployeeName(employeeId);
  };

  return {
    ...basicActions,
    ...linkOperations,
    ...scheduleOperations,
    handleShareAssessment,
    handleCloseResult,
    handleSendEmail,
    // Add the missing functions to the return object
    handleSaveAssessment,
    handleSubmitAssessment,
    getSelectedEmployeeName
  };
}
