import { useBasicAssessmentActions } from "./useBasicAssessmentActions";
import { useLinkOperations } from "./useLinkOperations";
import { useScheduleOperations } from "./useScheduleOperations";
import { ScheduledAssessment, ChecklistTemplate, ChecklistResult } from "@/types";
import { createAssessmentResult } from "@/services/assessmentHandlerService";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getPeriodicitySettings, getPeriodicityForRiskLevel } from "@/utils/assessmentUtils";
import { createScheduledAssessment, generateAssessmentLink, sendAssessmentEmail } from "@/services/assessmentService";

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
  const { data: periodicitySettings } = useQuery({
    queryKey: ['periodicitySettings'],
    queryFn: getPeriodicitySettings
  });

  const basicActions = useBasicAssessmentActions({
    setSelectedEmployee,
    setSelectedTemplate,
    setIsNewAssessmentDialogOpen,
    setActiveTab
  });

  const handleSaveAssessment = async () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return false;
    }

    try {
      const assessment = await createScheduledAssessment({
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

  const handleSaveSchedule = async (recurrenceType: string, phoneNumber: string) => {
    if (!selectedEmployee || !selectedTemplate || !scheduledDate) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const assessment = await createScheduledAssessment({
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

  const handleGenerateLink = async () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return;
    }

    try {
      const assessment = await createScheduledAssessment({
        employeeId: selectedEmployee,
        templateId: selectedTemplate.id,
        scheduledDate: new Date(),
      });

      const link = await generateAssessmentLink(assessment.id);
      setGeneratedLink(link.token);
      setIsLinkDialogOpen(true);
    } catch (error) {
      console.error("Error generating link:", error);
      toast.error("Erro ao gerar link.");
    }
  };

  const handleSendEmailToEmployee = async (assessmentId: string) => {
    try {
      await sendAssessmentEmail(assessmentId, "employee@email.com");
      toast.success("Email enviado com sucesso!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Erro ao enviar email.");
    }
  };

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
    // return getEmployeeName(employeeId);
    return "TODO"
  };

  return {
    ...basicActions,
    ...linkOperations,
    ...scheduleOperations,
    handleShareAssessment,
    handleCloseResult,
    handleSendEmail: handleSendEmailToEmployee,
    handleSaveAssessment,
    handleSubmitAssessment,
    getSelectedEmployeeName,
    handleGenerateLink,
    handleSaveSchedule
  };
}
