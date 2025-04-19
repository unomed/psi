
import { useAssessmentEmployeeOperations } from "./operations/useAssessmentEmployeeOperations";
import { useBasicAssessmentActions } from "./useBasicAssessmentActions";
import { useLinkOperations } from "./useLinkOperations";
import { useScheduleOperations } from "./useScheduleOperations";
import { ScheduledAssessment, ChecklistTemplate, RecurrenceType } from "@/types";
import { generateAssessmentLink, sendAssessmentEmail } from "@/services/assessment";
import { useAssessmentSubmission } from "./operations/useAssessmentSubmission";
import { useAssessmentSaveOperations } from "./operations/useAssessmentSaveOperations";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const { handleSaveSchedule } = useAssessmentSaveOperations();

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

  // Add missing function definitions
  const handleStartAssessment = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return;
    }
    
    setIsAssessmentDialogOpen(true);
  };

  const handleScheduleNewAssessment = (employeeId: string, templateId: string) => {
    setSelectedEmployee(employeeId);
    setSelectedTemplate({ id: templateId } as ChecklistTemplate);
    setIsScheduleDialogOpen(true);
  };

  const handleShareAssessment = (assessmentId: string) => {
    const assessment = { id: assessmentId } as ScheduledAssessment;
    setSelectedAssessment(assessment);
    setIsShareDialogOpen(true);
  };

  const handleSaveAssessment = async () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return false;
    }

    try {
      // Tenta salvar diretamente na tabela assessment_responses primeiro
      const employeeName = getSelectedEmployeeName(selectedEmployee);
      
      const { error: responseError } = await supabase
        .from('assessment_responses')
        .insert({
          template_id: selectedTemplate.id,
          employee_id: selectedEmployee,
          employee_name: employeeName,
          response_data: {},
          completed_at: new Date().toISOString()
        });

      if (responseError) {
        console.error("Erro ao salvar na tabela assessment_responses:", responseError);
        
        // Se falhar por restrição de chave estrangeira, tenta salvar como agendada
        const { error } = await supabase
          .from('scheduled_assessments')
          .insert({
            employee_id: selectedEmployee,
            template_id: selectedTemplate.id,
            scheduled_date: new Date().toISOString(),
            status: 'scheduled'
          });

        if (error) {
          console.error("Erro ao salvar agendamento:", error);
          toast.error("Erro ao salvar avaliação em ambas as tabelas");
          return false;
        }
        
        toast.success("Avaliação salva como agendada (não foi possível salvar como resposta)");
        return true;
      }

      toast.success("Avaliação salva com sucesso na tabela assessment_responses!");
      return true;
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast.error("Erro ao salvar avaliação.");
      return false;
    }
  };

  return {
    ...basicActions,
    ...linkOperations,
    ...scheduleOperations,
    handleShareAssessment,
    handleCloseResult,
    handleGenerateLink: linkOperations.handleGenerateLink,
    handleSendEmail,
    handleSaveAssessment,
    handleSubmitAssessment,
    getSelectedEmployeeName,
    handleScheduleNewAssessment,
    handleStartAssessment,
    handleSaveSchedule: (recurrenceType: RecurrenceType, phoneNumber: string) => 
      handleSaveSchedule(selectedEmployee, selectedTemplate, scheduledDate, recurrenceType, phoneNumber)
  };
}
