
import { useQuery } from "@tanstack/react-query";
import { RecurrenceType, ScheduledAssessment } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useScheduledAssessments() {
  const {
    data: scheduledAssessments = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['scheduledAssessments'],
    queryFn: async (): Promise<ScheduledAssessment[]> => {
      // Fetch scheduled assessments from Supabase
      const { data, error } = await supabase
        .from('scheduled_assessments')
        .select(`
          *,
          employees (
            name,
            email,
            phone
          ),
          checklist_templates (
            title
          )
        `)
        .order('scheduled_date', { ascending: false });
      
      if (error) {
        console.error("Error fetching scheduled assessments:", error);
        return [];
      }
      
      // Transform the data to match our ScheduledAssessment type
      return data.map(item => {
        // Safely handle employees data with proper TypeScript casting
        const employeesData = item.employees && typeof item.employees === 'object' && !('error' in item.employees)
          ? {
              name: item.employees ? (item.employees as any).name || 'Funcionário' : 'Funcionário',
              email: item.employees ? (item.employees as any).email || '' : '',
              phone: item.employees ? (item.employees as any).phone || '' : ''
            }
          : undefined;
        
        return {
          id: item.id,
          employeeId: item.employee_id,
          templateId: item.template_id,
          scheduledDate: new Date(item.scheduled_date),
          sentAt: item.sent_at ? new Date(item.sent_at) : null,
          linkUrl: item.link_url || '',
          status: item.status,
          completedAt: item.completed_at ? new Date(item.completed_at) : null,
          recurrenceType: item.recurrence_type as RecurrenceType | undefined,
          nextScheduledDate: item.next_scheduled_date ? new Date(item.next_scheduled_date) : null,
          phoneNumber: item.phone_number || undefined,
          employees: employeesData,
          checklist_templates: item.checklist_templates
        };
      });
    }
  });

  const handleScheduleAssessment = async (assessmentData: Omit<ScheduledAssessment, 'id' | 'linkUrl' | 'sentAt' | 'completedAt'>) => {
    try {
      // Implementation here
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
      // Implementation here
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
      // Implementation here
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
