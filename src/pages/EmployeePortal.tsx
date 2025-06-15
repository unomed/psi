
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { EmployeeLoginForm } from "@/components/employee/EmployeeLoginForm";
import { EmployeeDashboard } from "@/components/employee/EmployeeDashboard";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";

export default function EmployeePortal() {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const employeeIdFromUrl = searchParams.get("employee");
  const tokenFromUrl = searchParams.get("token");
  const { session, login, loading } = useEmployeeAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (employeeData: any) => {
    setIsAuthenticated(true);
  };

  // Mostrar loading durante verificação inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Carregando portal do funcionário...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !session?.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <EmployeeLoginForm 
          onLoginSuccess={handleLoginSuccess}
          expectedEmployeeId={employeeIdFromUrl}
          assessmentToken={tokenFromUrl}
          templateId={templateId}
        />
      </div>
    );
  }

  return (
    <EmployeeDashboard 
      assessmentToken={tokenFromUrl}
      templateId={templateId}
    />
  );
}
