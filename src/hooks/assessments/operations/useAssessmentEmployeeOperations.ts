
import { getPeriodicitySettings } from "@/utils/assessmentUtils";
import { useQuery } from "@tanstack/react-query";
import { useEmployees } from "@/hooks/useEmployees";

export function useAssessmentEmployeeOperations() {
  const { data: periodicitySettings } = useQuery({
    queryKey: ['periodicitySettings'],
    queryFn: getPeriodicitySettings
  });

  const { employees } = useEmployees();

  const getSelectedEmployeeName = (employeeId: string | null) => {
    if (!employeeId || !employees) return "";
    
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || "Funcionário não encontrado";
  };

  const getEmployeeById = (employeeId: string | null) => {
    if (!employeeId || !employees) return null;
    return employees.find(emp => emp.id === employeeId) || null;
  };

  const getEmployeeEmail = (employeeId: string | null) => {
    const employee = getEmployeeById(employeeId);
    return employee?.email || "";
  };

  const getEmployeePhone = (employeeId: string | null) => {
    const employee = getEmployeeById(employeeId);
    return employee?.phone || "";
  };

  return {
    periodicitySettings,
    getSelectedEmployeeName,
    getEmployeeById,
    getEmployeeEmail,
    getEmployeePhone,
    employees
  };
}
