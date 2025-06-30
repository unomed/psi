
import { useState } from "react";
import { useAssessmentSaveOperations } from "./assessments/operations/useAssessmentSaveOperations";
import { useScheduledAssessments } from "./checklist/useScheduledAssessments";

export function useAssessmentState() {
  const saveOperations = useAssessmentSaveOperations();
  const { scheduledAssessments } = useScheduledAssessments();
  
  const handleSaveSchedule = async (data: any) => {
    return await saveOperations.saveAssessment(data);
  };

  const handleSendEmail = async (assessmentId: string) => {
    // Implementation for sending email
    console.log('Sending email for assessment:', assessmentId);
  };
  
  return {
    ...saveOperations,
    scheduledAssessments: scheduledAssessments || [],
    handleSaveSchedule,
    handleSendEmail
  };
}
