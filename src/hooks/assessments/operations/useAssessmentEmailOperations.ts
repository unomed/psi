
import { toast } from "sonner";
import { ScheduledAssessment } from "@/types";
import { sendAssessmentEmail } from "@/services/assessment";

export function useAssessmentEmailOperations(
  scheduledAssessments: ScheduledAssessment[], 
  setScheduledAssessments: (assessments: ScheduledAssessment[]) => void
) {
  const handleSendEmail = async (scheduledAssessmentId: string) => {
    try {
      await sendAssessmentEmail(scheduledAssessmentId);
      
      // Update local state
      const updatedAssessments = scheduledAssessments.map(assessment => {
        if (assessment.id === scheduledAssessmentId) {
          return {
            ...assessment,
            sentAt: new Date(),
            status: "sent" as const
          };
        }
        return assessment;
      });
      
      setScheduledAssessments(updatedAssessments);
      
      // Find the assessment to display in the toast
      const assessment = scheduledAssessments.find(a => a.id === scheduledAssessmentId);
      if (assessment && assessment.employees?.name) {
        toast.success(`Email enviado para ${assessment.employees.name} (${assessment.employees.email})`);
      } else {
        toast.success("Email enviado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast.error("Erro ao enviar email. Tente novamente mais tarde.");
    }
  };

  return {
    handleSendEmail
  };
}
