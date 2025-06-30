
import { useState } from "react";
import { useAssessmentSaveOperations } from "./assessments/operations/useAssessmentSaveOperations";

export function useAssessmentState() {
  // Return only what the hook actually provides
  const saveOperations = useAssessmentSaveOperations();
  
  return {
    ...saveOperations
    // Removed non-existent properties: scheduledAssessments, setScheduledAssessments, handleSaveSchedule
  };
}
