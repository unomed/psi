
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
      // Verificar se o funcionário existe no banco de dados
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('id, name')
        .eq('id', selectedEmployee)
        .single();

      if (employeeError) {
        console.error("Erro ao verificar funcionário:", employeeError);
        toast.error(`Funcionário não encontrado no banco de dados: ${employeeError.message}`);
        return false;
      }

      // Verificar se o template existe no banco de dados
      const { data: templateData, error: templateError } = await supabase
        .from('checklist_templates')
        .select('id')
        .eq('id', selectedTemplate.id)
        .single();

      if (templateError) {
        console.error("Erro ao verificar template:", templateError);
        toast.error(`Modelo de checklist não encontrado no banco de dados: ${templateError.message}`);
        return false;
      }

      // Agora podemos tentar inserir na tabela assessment_responses com mais confiança
      const { data, error } = await supabase
        .from('assessment_responses')
        .insert({
          template_id: selectedTemplate.id,
          employee_id: selectedEmployee,
          employee_name: employeeData.name,
          response_data: {},
          completed_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error("Erro detalhado ao salvar:", error);
        
        if (error.code === '23503') { // Foreign key violation
          toast.error(`Erro de chave estrangeira: ${error.message}. Verifique se as informações do funcionário estão corretas.`);
        } else {
          toast.error(`Erro ao salvar avaliação: ${error.message}`);
        }
        return false;
      }

      toast.success("Avaliação salva com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro inesperado:", error);
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
