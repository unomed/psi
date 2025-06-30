import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistResult } from "@/types";
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
