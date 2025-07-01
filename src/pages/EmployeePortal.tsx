
import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { EmployeeLoginForm } from "@/components/employee/EmployeeLoginForm";
import { EmployeeModernDashboard } from "@/components/employee/modern/EmployeeModernDashboard";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { useEffect } from "react";

export default function EmployeePortal() {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeIdFromUrl = searchParams.get("employee");
  const assessmentIdFromUrl = searchParams.get("assessment");
  const { session, loading } = useEmployeeAuthNative();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log("[EmployeePortal] Parâmetros recebidos:", {
    templateId,
    employeeIdFromUrl,
    assessmentIdFromUrl,
    hasSession: !!session,
    sessionAuthenticated: session?.isAuthenticated,
    isAuthenticated,
    loading
  });

  const handleLoginSuccess = (employeeData: any) => {
    console.log("[EmployeePortal] Login bem-sucedido:", employeeData);
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

  // Se não está autenticado, mostrar formulário de login
  if (!isAuthenticated && !session?.isAuthenticated) {
    console.log("[EmployeePortal] Mostrando formulário de login");
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <EmployeeLoginForm 
          onLoginSuccess={handleLoginSuccess}
          expectedEmployeeId={employeeIdFromUrl}
          assessmentToken={null}
          templateId={templateId}
          assessmentId={assessmentIdFromUrl}
        />
        <InstallPrompt />
      </div>
    );
  }

  // Se está autenticado, mostrar dashboard moderno
  console.log("[EmployeePortal] Mostrando dashboard moderno do funcionário");
  return (
    <>
      <EmployeeModernDashboard 
        assessmentToken={null}
        templateId={templateId}
        assessmentId={assessmentIdFromUrl}
        expectedEmployeeId={employeeIdFromUrl}
      />
      <InstallPrompt />
    </>
  );
}
