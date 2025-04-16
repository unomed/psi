
import { useChecklistTemplates } from "./checklist/useChecklistTemplates";
import { useChecklistResults } from "./checklist/useChecklistResults";

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

  return {
    checklists,
    results,
    isLoading: isLoadingChecklists || isLoadingResults,
    handleCreateTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    handleCopyTemplate,
    refetchChecklists,
    refetchResults
  };
}
