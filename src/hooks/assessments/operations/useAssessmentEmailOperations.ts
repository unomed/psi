
import { useState } from "react";
import { ScheduledAssessment } from "@/types";
import { sendAssessmentEmail } from "@/services/assessment";
import { toast } from "sonner";
import { mockEmployees } from "@/components/assessments/AssessmentSelectionForm";

export function useAssessmentEmailOperations(scheduledAssessments: ScheduledAssessment[], setScheduledAssessments: (assessments: ScheduledAssessment[]) => void) {
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
      
      // Find the employee to display in the toast
      const assessment = scheduledAssessments.find(a => a.id === scheduledAssessmentId);
      if (assessment) {
        const employee = mockEmployees.find(e => e.id === assessment.employeeId);
        if (employee) {
          toast.success(`Email enviado para ${employee.name} (${employee.email})`);
        }
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
