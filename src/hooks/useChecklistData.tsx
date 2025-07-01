
import { useChecklistTemplates } from "./checklist/useChecklistTemplates";
import { useChecklistResults } from "./checklist/useChecklistResults";
import { useScheduledAssessments } from "./checklist/useScheduledAssessments";
import { ChecklistResult } from "@/types/checklist";
import { saveAssessmentResult } from "@/services/checklist";
import { sendAssessmentEmail } from "@/services/assessment";
import { toast } from "sonner";

interface UseChecklistDataProps {
  companyId?: string | null;
}

export function useChecklistData({ companyId }: UseChecklistDataProps = {}) {
  const {
    checklists,
    isLoading: isLoadingChecklists,
    handleCreateTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    handleCopyTemplate,
    refetchChecklists
  } = useChecklistTemplates();

  const {
    results,
    isLoading: isLoadingResults,
    refetchResults
  } = useChecklistResults();

  const {
    scheduledAssessments,
    isLoading: isLoadingScheduled,
    handleScheduleAssessment,
    handleSendEmail: originalHandleSendEmail,
    handleShareAssessment,
    refetch: refetchScheduled
  } = useScheduledAssessments({ companyId });

  // Método melhorado para envio de email
  const handleSendEmail = async (assessmentId: string) => {
    try {
      await sendAssessmentEmail(assessmentId);
      toast.success("Email reenviado com sucesso!");
      refetchScheduled();
    } catch (error) {
      console.error("Erro ao reenviar email:", error);
      toast.error("Erro ao reenviar email");
    }
  };

  // Método para salvar resultados de avaliação
  const handleSaveAssessmentResult = async (result: Omit<ChecklistResult, "id" | "completedAt"> | any) => {
    try {
      await saveAssessmentResult(result);
      toast.success("Resultado da avaliação salvo com sucesso!");
      refetchResults();
      return true;
    } catch (error) {
      console.error("Erro ao salvar resultado da avaliação:", error);
      toast.error("Erro ao salvar resultado da avaliação");
      return false;
    }
  };

  return {
    checklists,
    results,
    scheduledAssessments,
    isLoading: isLoadingChecklists || isLoadingResults || isLoadingScheduled,
    handleCreateTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    handleCopyTemplate,
    handleScheduleAssessment,
    handleSendEmail,
    handleShareAssessment,
    handleSaveAssessmentResult,
    refetchChecklists,
    refetchResults,
    refetch: refetchScheduled
  };
}
