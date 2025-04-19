
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

    try {
      // Exibir informações de diagnóstico para debug
      console.log("Tentando salvar avaliação para employee_id:", selectedEmployee);
      console.log("Tipo de employee_id:", typeof selectedEmployee);

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

      // Agora tenta salvar diretamente na tabela assessment_responses
      const { data, error } = await supabase
        .from('assessment_responses')
        .insert({
          template_id: selectedTemplate.id,
          employee_id: selectedEmployee,
          employee_name: employeeData[0].name,
          response_data: {}, // Objeto vazio para atender à restrição de não nulo
          completed_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error("Erro ao salvar em assessment_responses:", error);
        toast.error(`Erro ao salvar avaliação: ${error.message}`);
        
        // Se falhar, tenta salvar como avaliação agendada como fallback
        const { data: scheduledData, error: scheduledError } = await supabase
          .from('scheduled_assessments')
          .insert({
            employee_id: selectedEmployee,
            template_id: selectedTemplate.id,
            scheduled_date: new Date().toISOString(),
            status: 'completed',
            completed_at: new Date().toISOString(),
            recurrence_type: 'none'
          })
          .select();

        if (scheduledError) {
          console.error("Erro ao salvar em scheduled_assessments:", scheduledError);
          toast.error(`Não foi possível salvar a avaliação: ${scheduledError.message}`);
          return false;
        }

        console.log("Avaliação salva como agendada (fallback):", scheduledData);
        toast.success("Avaliação salva com sucesso!");
        toast.info("A avaliação foi salva como agendada devido a uma limitação temporária.");
        return true;
      }

      console.log("Avaliação salva com sucesso em assessment_responses:", data);
      toast.success("Avaliação salva com sucesso!");
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
