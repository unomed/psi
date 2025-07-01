
import { useQuery } from "@tanstack/react-query";
import { ChecklistResult } from "@/types/checklist";
import { fetchAssessmentResults } from "@/services/checklist";

export function useChecklistResults() {
  const { 
    data: results = [], 
    isLoading,
    refetch: refetchResults
  } = useQuery({
    queryKey: ['assessmentResults'],
    queryFn: fetchAssessmentResults
  });

  return {
    results,
    isLoading,
    refetchResults
  };
}
