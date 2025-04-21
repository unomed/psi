
import { useChecklistTemplates } from "./checklist/useChecklistTemplates";
import { useChecklistResults } from "./checklist/useChecklistResults";
import { useScheduledAssessments } from "./checklist/useScheduledAssessments";
import { ChecklistResult } from "@/types/checklist";
import { saveAssessmentResult } from "@/services/checklistService";
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
    handleSendEmail,
    handleShareAssessment
  } = useScheduledAssessments({ companyId });

  // Novo método para salvar resultados de avaliação (incluindo psicossocial)
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
    refetchResults
  };
}
