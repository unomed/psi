
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
        // First, fetch the scheduled assessments without trying to join with employees
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
        
        // Once we have the scheduled assessments, fetch the employee details separately
        const assessmentData = await Promise.all(
          data.map(async (item) => {
            // Try to get employee details if we have an employee_id
            let employeeDetails = null;
            
            if (item.employee_id) {
              const { data: employeeData, error: employeeError } = await supabase
                .from('employees')
                .select('name, email, phone')
                .eq('id', item.employee_id)
                .single();
              
              if (!employeeError && employeeData) {
                employeeDetails = {
                  name: employeeData.name,
                  email: employeeData.email || '',
                  phone: employeeData.phone || ''
                };
              }
            }
            
            // Use employee_name as fallback if no employee details found
            if (!employeeDetails) {
              employeeDetails = {
                name: item.employee_name || 'Funcionário não encontrado',
                email: '',
                phone: ''
              };
            }
            
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
          })
        );
        
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
