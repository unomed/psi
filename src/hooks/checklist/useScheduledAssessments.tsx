
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RecurrenceType, ScheduledAssessment, AssessmentStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

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
            created_at,
            updated_at,
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
        
        const assessmentData = data.map((item) => ({
          id: item.id,
          company_id: item.company_id,
          checklist_template_id: item.template_id,
          employee_ids: [item.employee_id],
          scheduled_date: item.scheduled_date,
          status: item.status as AssessmentStatus,
          recurrence_type: item.recurrence_type as RecurrenceType | undefined,
          next_scheduled_date: item.next_scheduled_date,
          phone_number: item.phone_number,
          created_at: item.created_at,
          updated_at: item.updated_at,
          // Legacy fields for compatibility
          employeeId: item.employee_id,
          templateId: item.template_id,
          scheduledDate: new Date(item.scheduled_date),
          sentAt: item.sent_at ? new Date(item.sent_at) : null,
          linkUrl: item.link_url || '',
          completedAt: item.completed_at ? new Date(item.completed_at) : null,
          nextScheduledDate: item.next_scheduled_date ? new Date(item.next_scheduled_date) : null,
          phoneNumber: item.phone_number || undefined,
          employees: {
            name: item.employee_name || 'Funcionário não encontrado',
            email: '',
            phone: ''
          },
          checklist_templates: item.checklist_templates
        }));
        
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
          status: assessmentData.status,
          recurrence_type: assessmentData.recurrence_type,
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
      
      // Deletar a avaliação principal
      const { error: deleteError } = await supabase
        .from('scheduled_assessments')
        .delete()
        .eq('id', assessmentId);
      
      if (deleteError) {
        console.error("Erro ao deletar avaliação:", deleteError);
        throw deleteError;
      }
      
      console.log(`Avaliação ${assessmentId} deletada com sucesso`);
      toast.success("Avaliação deletada com sucesso!");
      refetch();
      return true;
    } catch (error) {
      console.error("Erro ao deletar avaliação:", error);
      toast.error("Erro ao deletar avaliação");
      return false;
    }
  };

  return {
    scheduledAssessments,
    isLoading,
    refetch,
    handleScheduleAssessment,
    handleDeleteAssessment
  };
}
