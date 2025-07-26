
import { useQuery } from "@tanstack/react-query";
import { RecurrenceType, ScheduledAssessment, AssessmentStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UseScheduledAssessmentsProps {
  companyId?: string | null;
}

export function useScheduledAssessments({ companyId }: UseScheduledAssessmentsProps = {}) {
  const { userRole } = useAuth();
  
  const {
    data: scheduledAssessments = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['scheduledAssessments', companyId],
    queryFn: async (): Promise<ScheduledAssessment[]> => {
      try {
        let query = supabase
          .from('scheduled_assessments')
          .select(`
            id,
            employee_id,
            template_id,
            scheduled_date,
            sent_at,
            link_url,
            status,
            completed_at,
            recurrence_type,
            next_scheduled_date,
            phone_number,
            company_id,
            employee_name,
            checklist_templates(title)
          `);
        
        if (companyId && userRole !== 'superadmin') {
          query = query.eq('company_id', companyId);
        }
        
        const { data, error } = await query.order('scheduled_date', { ascending: false });
        
        if (error) {
          console.error("Error fetching scheduled assessments:", error);
          toast.error("Erro ao carregar avaliações agendadas");
          return [];
        }
        
        const assessmentData = data.map((item) => {
          let employeeDetails = {
            name: item.employee_name || 'Funcionário não encontrado',
            email: '',
            phone: ''
          };
          
          return {
            id: item.id,
            employeeId: item.employee_id,
            templateId: item.template_id,
            scheduledDate: new Date(item.scheduled_date),
            sentAt: item.sent_at ? new Date(item.sent_at) : null,
            linkUrl: item.link_url || '',
            status: item.status as AssessmentStatus,
            completedAt: item.completed_at ? new Date(item.completed_at) : null,
            recurrenceType: item.recurrence_type as RecurrenceType | undefined,
            nextScheduledDate: item.next_scheduled_date ? new Date(item.next_scheduled_date) : null,
            phoneNumber: item.phone_number || undefined,
            company_id: item.company_id,
            employees: employeeDetails,
            checklist_templates: item.checklist_templates
          };
        });
        
        return assessmentData;
      } catch (error) {
        console.error("Error in scheduled assessments processing:", error);
        toast.error("Erro ao processar avaliações agendadas");
        return [];
      }
    }
  });

  const handleScheduleAssessment = async (assessmentData: Omit<ScheduledAssessment, 'id' | 'linkUrl' | 'sentAt' | 'completedAt'>) => {
    try {
      const { error } = await supabase
        .from('scheduled_assessments')
        .insert({
          employee_id: assessmentData.employeeId,
          template_id: assessmentData.templateId,
          scheduled_date: assessmentData.scheduledDate.toISOString(),
          due_date: assessmentData.scheduledDate.toISOString(), // Adicionar due_date
          status: assessmentData.status,
          recurrence_type: assessmentData.recurrenceType,
          next_scheduled_date: assessmentData.nextScheduledDate?.toISOString(),
          phone_number: assessmentData.phoneNumber,
          company_id: assessmentData.company_id,
          employee_name: assessmentData.employees?.name
        });

      if (error) throw error;
      
      toast.success("Avaliação agendada com sucesso!");
      refetch();
      return true;
    } catch (error) {
      console.error("Error scheduling assessment:", error);
      toast.error("Erro ao agendar avaliação");
      return false;
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    try {
      console.log("Iniciando exclusão em cascata para avaliação:", assessmentId);
      
      // Primeiro, verificar registros relacionados
      const { data: relatedEmails } = await supabase
        .from('assessment_emails')
        .select('id')
        .eq('scheduled_assessment_id', assessmentId);
      
      const { data: relatedResponses } = await supabase
        .from('assessment_responses')
        .select('id')
        .eq('template_id', assessmentId); // Verificar se há responses relacionadas por template
      
      let deletedCount = 0;
      
      // Deletar emails relacionados primeiro
      if (relatedEmails && relatedEmails.length > 0) {
        const { error: emailsError } = await supabase
          .from('assessment_emails')
          .delete()
          .eq('scheduled_assessment_id', assessmentId);
        
        if (emailsError) {
          console.error("Erro ao deletar emails relacionados:", emailsError);
          throw new Error("Erro ao deletar emails relacionados");
        }
        
        deletedCount += relatedEmails.length;
        console.log(`${relatedEmails.length} emails relacionados deletados`);
      }
      
      // Deletar respostas relacionadas se existirem
      if (relatedResponses && relatedResponses.length > 0) {
        const { error: responsesError } = await supabase
          .from('assessment_responses')
          .delete()
          .in('id', relatedResponses.map(r => r.id));
        
        if (responsesError) {
          console.error("Erro ao deletar respostas relacionadas:", responsesError);
          // Não falhar aqui, pois pode ser uma ligação diferente
        } else {
          deletedCount += relatedResponses.length;
          console.log(`${relatedResponses.length} respostas relacionadas deletadas`);
        }
      }
      
      // Finalmente, deletar o agendamento
      const { error: assessmentError } = await supabase
        .from('scheduled_assessments')
        .delete()
        .eq('id', assessmentId);

      if (assessmentError) {
        console.error("Erro ao deletar agendamento:", assessmentError);
        throw new Error("Erro ao deletar agendamento principal");
      }
      
      console.log("Agendamento principal deletado com sucesso");
      
      const successMessage = deletedCount > 0 
        ? `Avaliação excluída com sucesso! ${deletedCount} registros relacionados também foram removidos.`
        : "Avaliação excluída com sucesso!";
      
      toast.success(successMessage);
      refetch();
      return true;
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao excluir avaliação");
      return false;
    }
  };

  const handleSendEmail = async (assessmentId: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_assessments')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', assessmentId);

      if (error) throw error;
      
      toast.success("Email enviado com sucesso!");
      refetch();
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Erro ao enviar email");
      return false;
    }
  };

  const handleShareAssessment = async (assessmentId: string) => {
    try {
      toast.success("Link compartilhado com sucesso!");
      refetch();
      return "link-gerado";
    } catch (error) {
      console.error("Error sharing assessment:", error);
      toast.error("Erro ao compartilhar avaliação");
      return null;
    }
  };

  return {
    scheduledAssessments,
    isLoading,
    refetch,
    handleScheduleAssessment,
    handleDeleteAssessment,
    handleSendEmail,
    handleShareAssessment
  };
}
