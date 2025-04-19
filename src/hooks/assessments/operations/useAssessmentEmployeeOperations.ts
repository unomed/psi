
import { getPeriodicitySettings } from "@/utils/assessmentUtils";
import { useQuery } from "@tanstack/react-query";

export function useAssessmentEmployeeOperations() {
  const { data: periodicitySettings } = useQuery({
    queryKey: ['periodicitySettings'],
    queryFn: getPeriodicitySettings
  });

  const getSelectedEmployeeName = (employeeId: string | null) => {
    // TODO: Implement actual employee name lookup
    return "TODO";
  };

  return {
    periodicitySettings,
    getSelectedEmployeeName
  };
}
