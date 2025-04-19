
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
  const { getSelectedEmployeeName, getEmployeeById } = useAssessmentEmployeeOperations();
  
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

  // Função para lidar com o salvamento de avaliações
  const handleSaveAssessment = async () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return false;
    }

    if (!scheduledDate) {
      toast.error("Selecione uma data para a avaliação.");
      return false;
    }

    try {
      // Exibir informações de diagnóstico para debug
      console.log("Tentando salvar avaliação para employee_id:", selectedEmployee);
      console.log("Tipo de employee_id:", typeof selectedEmployee);
      console.log("Data agendada:", scheduledDate);

      // Verificar se o funcionário existe na tabela employees
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('id, name')
        .eq('id', selectedEmployee);

      if (employeeError || !employeeData || employeeData.length === 0) {
        console.error("Erro ao verificar funcionário:", employeeError);
        toast.error(`Funcionário não encontrado na tabela employees: ${employeeError?.message || "Nenhum registro encontrado"}`);
        return false;
      }

      console.log("Funcionário encontrado na tabela employees:", employeeData[0]);

      // Get employee's risk level and corresponding periodicity
      const { data: employeeWithRole } = await supabase
        .from('employees')
        .select(`
          id,
          roles (
            risk_level
          )
        `)
        .eq('id', selectedEmployee)
        .single();

      const riskLevel = employeeWithRole?.roles?.risk_level;

      // Get periodicity settings
      const { data: periodicitySettings } = await supabase
        .from('periodicity_settings')
        .select('*')
        .single();

      let suggestedRecurrenceType = 'none';
      if (riskLevel && periodicitySettings) {
        switch (riskLevel.toLowerCase()) {
          case 'high':
            suggestedRecurrenceType = periodicitySettings.risk_high_periodicity;
            break;
          case 'medium':
            suggestedRecurrenceType = periodicitySettings.risk_medium_periodicity;
            break;
          case 'low':
            suggestedRecurrenceType = periodicitySettings.risk_low_periodicity;
            break;
          default:
            suggestedRecurrenceType = periodicitySettings.default_periodicity;
        }
      }

      // Calculate next scheduled date based on recurrence type
      let nextScheduledDate = null;
      if (suggestedRecurrenceType !== 'none') {
        nextScheduledDate = new Date(scheduledDate);
        switch (suggestedRecurrenceType) {
          case 'monthly':
            nextScheduledDate.setMonth(nextScheduledDate.getMonth() + 1);
            break;
          case 'semiannual':
            nextScheduledDate.setMonth(nextScheduledDate.getMonth() + 6);
            break;
          case 'annual':
            nextScheduledDate.setFullYear(nextScheduledDate.getFullYear() + 1);
            break;
        }
      }

      // Salvar como avaliação agendada (scheduled_assessments)
      const { data: scheduledData, error: scheduledError } = await supabase
        .from('scheduled_assessments')
        .insert({
          employee_id: selectedEmployee,
          template_id: selectedTemplate.id,
          scheduled_date: scheduledDate.toISOString(),
          status: 'scheduled',
          recurrence_type: suggestedRecurrenceType,
          next_scheduled_date: nextScheduledDate?.toISOString()
        })
        .select();

      if (scheduledError) {
        console.error("Erro ao salvar em scheduled_assessments:", scheduledError);
        toast.error(`Erro ao agendar avaliação: ${scheduledError.message}`);
        return false;
      }

      console.log("Avaliação agendada com sucesso:", scheduledData);
      toast.success("Avaliação agendada com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro geral:", error);
      toast.error("Erro ao salvar avaliação.");
      return false;
    }
  };

  // Funções adicionais
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
