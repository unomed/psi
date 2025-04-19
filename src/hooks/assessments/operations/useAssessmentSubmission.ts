
import { toast } from "sonner";
import { createAssessmentResult } from "@/services/assessmentHandlerService";
import { ChecklistResult } from "@/types";

export function useAssessmentSubmission({
  setAssessmentResult,
  setIsAssessmentDialogOpen,
  setIsResultDialogOpen,
}: {
  setAssessmentResult: (result: any) => void;
  setIsAssessmentDialogOpen: (isOpen: boolean) => void;
  setIsResultDialogOpen: (isOpen: boolean) => void;
}) {
  const handleSubmitAssessment = (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
    try {
      const result = createAssessmentResult(resultData);
      setAssessmentResult(result);
      setIsAssessmentDialogOpen(false);
      setIsResultDialogOpen(true);
      return result;
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Erro ao enviar avaliação.");
      return null;
    }
  };

  const handleCloseResult = () => {
    setIsResultDialogOpen(false);
    setAssessmentResult(null);
  };

  return {
    handleSubmitAssessment,
    handleCloseResult
  };
}
