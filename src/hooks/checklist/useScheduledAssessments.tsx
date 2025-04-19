
import { useQuery } from "@tanstack/react-query";
import { RecurrenceType, ScheduledAssessment } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createScheduledAssessment, sendAssessmentEmail, generateAssessmentLink } from "@/services/assessmentService";

export function useScheduledAssessments() {
  const { 
    data: scheduledAssessments = [], 
    isLoading,
    refetch: refetchScheduled
  } = useQuery({
    queryKey: ['scheduledAssessments'],
    queryFn: async () => {
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

      if (error) throw error;
      
      // Transform the data to match our ScheduledAssessment type
      return data.map(item => {
        // Safely handle employees data with proper TypeScript casting
        const employeesData = item.employees && typeof item.employees === 'object' && !('error' in item.employees)
          ? {
              name: item.employees ? (item.employees as any)?.name || 'Funcionário' : 'Funcionário',
              email: item.employees ? (item.employees as any)?.email || '' : '',
              phone: item.employees ? (item.employees as any)?.phone || '' : ''
            }
          : undefined;

        return {
          id: item.id,
          employeeId: item.employee_id,
          templateId: item.template_id,
          scheduledDate: new Date(item.scheduled_date),
          sentAt: item.sent_at ? new Date(item.sent_at) : null,
          linkUrl: item.link_url || "",
          status: item.status,
          completedAt: item.completed_at ? new Date(item.completed_at) : null,
          recurrenceType: item.recurrence_type as RecurrenceType | undefined,
          nextScheduledDate: item.next_scheduled_date ? new Date(item.next_scheduled_date) : null,
          phoneNumber: item.phone_number,
          employees: employeesData,
          checklist_templates: item.checklist_templates
        };
      }) as ScheduledAssessment[];
    }
  });

  const handleScheduleAssessment = async (
    employeeId: string,
    templateId: string,
    scheduledDate: Date,
    recurrenceType: "none" | "monthly" | "semiannual" | "annual",
    phoneNumber?: string
  ) => {
    try {
      await createScheduledAssessment({
        employeeId,
        templateId,
        scheduledDate,
        recurrenceType,
        phoneNumber
      });
      
      toast.success("Avaliação agendada com sucesso!");
      refetchScheduled();
      return true;
    } catch (error) {
      console.error("Error scheduling assessment:", error);
      toast.error("Erro ao agendar avaliação.");
      return false;
    }
  };

  const handleSendEmail = async (assessmentId: string) => {
    try {
      const assessment = scheduledAssessments.find(a => a.id === assessmentId);
      if (!assessment?.employees?.email) {
        toast.error("Funcionário não possui email cadastrado");
        return false;
      }

      await sendAssessmentEmail(assessmentId, assessment.employees.email);
      refetchScheduled();
      return true;
    } catch (error) {
      console.error("Error sending assessment email:", error);
      toast.error("Erro ao enviar email.");
      return false;
    }
  };

  const handleShareAssessment = async (assessmentId: string) => {
    try {
      const link = await generateAssessmentLink(assessmentId);
      refetchScheduled();
      return link.token;
    } catch (error) {
      console.error("Error sharing assessment:", error);
      toast.error("Erro ao gerar link.");
      return null;
    }
  };

  return {
    scheduledAssessments,
    isLoading,
    handleScheduleAssessment,
    handleSendEmail,
    handleShareAssessment,
    refetchScheduled
  };
}
