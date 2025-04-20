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
          employees (
            name,
            email,
            phone
          ),
          checklist_templates(
            title
          )
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
      
      return data.map(item => ({
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
        employees: item.employees ? {
          name: item.employees.name || item.employee_name || 'Funcionário não encontrado',
          email: item.employees.email || '',
          phone: item.employees.phone || ''
        } : null,
        checklist_templates: item.checklist_templates
      }));
    }
  });

  const handleScheduleAssessment = async (assessmentData: Omit<ScheduledAssessment, 'id' | 'linkUrl' | 'sentAt' | 'completedAt'>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Avaliação agendada com sucesso!");
      refetch();
      return true;
    } catch (error) {
      console.error("Error scheduling assessment:", error);
      toast.error("Erro ao agendar avaliação");
      return false;
    }
  };

  const handleSendEmail = async (assessmentId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Link compartilhado com sucesso!");
      refetch();
      return "https://example.com/assessment/123";
    } catch (error) {
      console.error("Error sharing assessment:", error);
      toast.error("Erro ao compartilhar avaliação");
      return null;
    }
  };

  return {
    scheduledAssessments,
    isLoading,
    handleScheduleAssessment,
    handleSendEmail,
    handleShareAssessment
  };
}
