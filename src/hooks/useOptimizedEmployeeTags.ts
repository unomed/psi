
import { useOptimizedEmployeeTagsCore } from "./useOptimizedEmployeeTagsCore";
import { useOptimizedTagTypes } from "./useOptimizedTagTypes";
import { useTagStatistics } from "./useTagStatistics";

interface UseOptimizedEmployeeTagsOptions {
  employeeId?: string;
  realTimeUpdates?: boolean;
  enableCache?: boolean;
}

export function useOptimizedEmployeeTags({
  employeeId,
  realTimeUpdates = true,
  enableCache = true
}: UseOptimizedEmployeeTagsOptions) {
  const coreResult = useOptimizedEmployeeTagsCore({
    employeeId,
    realTimeUpdates,
    enableCache
  });

  const tagStatistics = useTagStatistics(coreResult.employeeTags);

  return {
    ...coreResult,
    tagStatistics
  };
}

// Re-export the tag types hook for convenience
export { useOptimizedTagTypes } from "./useOptimizedTagTypes";
