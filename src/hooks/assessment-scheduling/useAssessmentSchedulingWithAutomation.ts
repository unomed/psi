import { Employee } from "@/types";
import { useAssessmentScheduling } from "./useAssessmentScheduling";

export function useAssessmentSchedulingWithAutomation() {
  const baseScheduling = useAssessmentScheduling();
  
  return {
    ...baseScheduling,
    // Add automation-specific functionality here
  };
}
