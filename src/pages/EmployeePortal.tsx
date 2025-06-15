
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { EmployeeLoginForm } from "@/components/employee/EmployeeLoginForm";
import { EmployeeDashboard } from "@/components/employee/EmployeeDashboard";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";

export default function EmployeePortal() {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const employeeIdFromUrl = searchParams.get("employee");
  const { employee, setEmployee } = useEmployeeAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (employeeData: any) => {
    setEmployee(employeeData);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated || !employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <EmployeeLoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return <EmployeeDashboard />;
}
