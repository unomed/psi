
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { EmployeeLoginForm } from "@/components/employee/EmployeeLoginForm";
import { EmployeeModernDashboard } from "@/components/employee/modern/EmployeeModernDashboard";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";

export default function EmployeePortal() {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const employeeIdFromUrl = searchParams.get("employee");
  const tokenFromUrl = searchParams.get("token");
  const { session, loading } = useEmployeeAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log("[EmployeePortal] Parâmetros recebidos:", {
    templateId,
    employeeIdFromUrl,
    tokenFromUrl: tokenFromUrl ? `${tokenFromUrl.substring(0, 10)}...` : null,
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
          assessmentToken={tokenFromUrl}
          templateId={templateId}
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
        assessmentToken={tokenFromUrl}
        templateId={templateId}
      />
      <InstallPrompt />
    </>
  );
}
