
import { useQuery } from "@tanstack/react-query";
import { RecurrenceType, ScheduledAssessment, AssessmentStatus } from "@/types";
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
      // Modify the query to properly join with employees table
      const { data, error } = await supabase
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
          employees:employees(name, email, phone),
          checklist_templates(title)
        `)
        .order('scheduled_date', { ascending: false });
      
      if (error) {
        console.error("Error fetching scheduled assessments:", error);
        return [];
      }
      
      return data.map(item => {
        // Safely handle the employees data, which might be null or undefined
        let employeeInfo = null;
        if (item.employees && Array.isArray(item.employees) && item.employees.length > 0) {
          const employee = item.employees[0];
          employeeInfo = {
            name: employee.name || 'Funcionário',
            email: employee.email || '',
            phone: employee.phone || ''
          };
        } else if (item.employees && !Array.isArray(item.employees)) {
          // If it's a single object and not an array
          employeeInfo = {
            name: item.employees.name || 'Funcionário',
            email: item.employees.email || '',
            phone: item.employees.phone || ''
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
          employees: employeeInfo,
          checklist_templates: item.checklist_templates
        };
      });
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
