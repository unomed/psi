
import { useQuery } from "@tanstack/react-query";
import { ScheduledAssessment } from "@/types";
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
      return data as ScheduledAssessment[];
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
