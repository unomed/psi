
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useOptimizedQueries() {
  const queryClient = useQueryClient();

  const invalidateRelatedQueries = useCallback((patterns: string[]) => {
    patterns.forEach(pattern => {
      queryClient.invalidateQueries({ 
        queryKey: [pattern],
        exact: false 
      });
    });
  }, [queryClient]);

  const prefetchQuery = useCallback((queryKey: string[], queryFn: () => Promise<any>) => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 5 * 60 * 1000, // 5 minutos
    });
  }, [queryClient]);

  const setQueryData = useCallback((queryKey: string[], data: any) => {
    queryClient.setQueryData(queryKey, data);
  }, [queryClient]);

  const removeQueries = useCallback((patterns: string[]) => {
    patterns.forEach(pattern => {
      queryClient.removeQueries({ 
        queryKey: [pattern],
        exact: false 
      });
    });
  }, [queryClient]);

  return {
    invalidateRelatedQueries,
    prefetchQuery,
    setQueryData,
    removeQueries,
  };
}
