
import { useChecklistTemplates } from "./checklist/useChecklistTemplates";
import { useChecklistResults } from "./checklist/useChecklistResults";
import { useScheduledAssessments } from "./checklist/useScheduledAssessments";

export function useChecklistData() {
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
  } = useScheduledAssessments();

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
    refetchChecklists,
    refetchResults
  };
}
