
import { useQuery } from "@tanstack/react-query";
import { ScheduledAssessment } from "@/types/checklist";
import { 
  fetchScheduledAssessments,
  saveScheduledAssessment,
  sendAssessmentEmail,
  generateAssessmentLink 
} from "@/services/checklistService";
import { toast } from "sonner";

export function useScheduledAssessments() {
  const { 
    data: scheduledAssessments = [], 
    isLoading,
    refetch: refetchScheduled
  } = useQuery({
    queryKey: ['scheduledAssessments'],
    queryFn: fetchScheduledAssessments
  });

  const handleScheduleAssessment = async (
    employeeId: string,
    templateId: string,
    scheduledDate: Date,
    recurrenceType: "none" | "monthly" | "semiannual" | "annual",
    phoneNumber?: string
  ) => {
    try {
      await saveScheduledAssessment({
        employeeId,
        templateId,
        scheduledDate,
        status: "scheduled",
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
      await sendAssessmentEmail(assessmentId);
      toast.success("Email enviado com sucesso!");
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
      const assessment = scheduledAssessments.find(a => a.id === assessmentId);
      if (!assessment) throw new Error("Assessment not found");
      
      const link = generateAssessmentLink(assessment.templateId, assessment.employeeId);
      
      // In a real app, this would update the assessment with the link
      await saveScheduledAssessment({
        ...assessment,
        linkUrl: link,
        status: "sent"
      });

      toast.success("Link gerado com sucesso!");
      refetchScheduled();
      return link;
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
