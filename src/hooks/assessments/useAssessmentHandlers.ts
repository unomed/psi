
import { useAssessmentEmployeeOperations } from "./operations/useAssessmentEmployeeOperations";
import { useBasicAssessmentActions } from "./useBasicAssessmentActions";
import { useLinkOperations } from "./useLinkOperations";
import { useScheduleOperations } from "./useScheduleOperations";
import { useAssessmentSubmission } from "./operations/useAssessmentSubmission";
import { useAssessmentSaveOperations } from "./operations/useAssessmentSaveOperations";
import { useAssessmentCreation } from "./operations/useAssessmentCreation";
import { useAssessmentScheduling } from "./operations/useAssessmentScheduling";
import { ScheduledAssessment, ChecklistTemplate } from "@/types";
import { isValidDate, createSafeDate } from "@/utils/dateUtils";

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
  const { getSelectedEmployeeName } = useAssessmentEmployeeOperations();
  const { handleSubmitAssessment, handleCloseResult } = useAssessmentSubmission({
    setAssessmentResult,
    setIsAssessmentDialogOpen,
    setIsResultDialogOpen
  });

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

  const { handleSaveAssessment } = useAssessmentCreation();
  const { handleScheduleNewAssessment, handleStartAssessment } = useAssessmentScheduling();

  const handleShareAssessment = (assessmentId: string) => {
    const assessment = { id: assessmentId } as ScheduledAssessment;
    setSelectedAssessment(assessment);
    setIsShareDialogOpen(true);
  };

  return {
    ...basicActions,
    ...linkOperations,
    ...scheduleOperations,
    handleShareAssessment,
    handleCloseResult,
    handleGenerateLink: linkOperations.handleGenerateLink,
    handleSendEmail,
    handleSaveAssessment: (date?: Date) => {
      // Realizar validação adicional da data antes de salvar
      let dateToUse: Date | undefined;
      
      if (date && isValidDate(date)) {
        // Criar uma nova instância segura da data fornecida
        dateToUse = createSafeDate(date);
        console.log("useAssessmentHandlers: Usando data fornecida:", dateToUse);
      } else if (scheduledDate && isValidDate(scheduledDate)) {
        // Criar uma nova instância segura da data do estado
        dateToUse = createSafeDate(scheduledDate);
        console.log("useAssessmentHandlers: Usando data do estado:", dateToUse);
      } else {
        console.log("useAssessmentHandlers: Nenhuma data válida disponível");
        dateToUse = undefined;
      }
      
      return handleSaveAssessment(selectedEmployee, selectedTemplate, dateToUse);
    },
    handleSubmitAssessment,
    getSelectedEmployeeName,
    handleScheduleNewAssessment: (employeeId: string, templateId: string) => 
      handleScheduleNewAssessment(setSelectedEmployee, setSelectedTemplate, setIsScheduleDialogOpen, employeeId, templateId),
    handleStartAssessment: () => handleStartAssessment(selectedEmployee, selectedTemplate, setIsAssessmentDialogOpen),
    handleSaveSchedule: scheduleOperations.handleSaveSchedule
  };
}
