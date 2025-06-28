
import { Routes, Route, Navigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { AuthRoutes } from "./AuthRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import MainLayout from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { SafeEmployeeGuard } from "@/components/auth/SafeEmployeeGuard";
import { EmployeeAuthNativeProvider } from "@/contexts/EmployeeAuthNative";
import EmployeePortal from "@/pages/EmployeePortal";
import PublicAssessment from "@/pages/PublicAssessment";
import ChecklistPortal from "@/pages/ChecklistPortal";
import { AssessmentResponse } from "@/components/employee/AssessmentResponse";
import { FormErrorBoundary } from "@/components/ui/form-error-boundary";
import { EmployeeErrorBoundary } from "@/components/ui/employee-error-boundary";
import EmployeeLoginIsolated from "@/pages/auth/EmployeeLoginIsolated";

export function AppRoutes() {
  const { user, isLoading } = useSimpleAuth();

  console.log('[AppRoutes] Estado atual:', {
    hasUser: !!user,
    isLoading,
    currentPath: window.location.pathname
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div className="text-muted-foreground">
            <p>Verificando autenticação...</p>
            <p className="text-sm mt-2">Conectando com banco de dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Direct login route - redirect to auth/login */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />

      {/* Rotas de autenticação - PRIORIDADE MÁXIMA */}
      <Route path="/auth/*" element={
        <FormErrorBoundary>
          <AuthRoutes />
        </FormErrorBoundary>
      } />

      {/* Nova rota para checklist com validação */}
      <Route path="/checklist/:checklistName" element={<ChecklistPortal />} />
      <Route path="/checklist" element={<ChecklistPortal />} />

      {/* ROTA ISOLADA PARA FUNCIONÁRIOS - SISTEMA NATIVO */}
      <Route path="/auth/employee" element={
        <EmployeeErrorBoundary>
          <EmployeeLoginIsolated />
        </EmployeeErrorBoundary>
      } />
      
      {/* Portal do funcionário com provider nativo */}
      <Route path="/employee-portal" element={
        <EmployeeErrorBoundary>
          <EmployeeAuthNativeProvider>
            <SafeEmployeeGuard>
              <EmployeePortal />
            </SafeEmployeeGuard>
          </EmployeeAuthNativeProvider>
        </EmployeeErrorBoundary>
      } />
      
      <Route path="/employee-portal/:templateId" element={
        <EmployeeErrorBoundary>
          <EmployeeAuthNativeProvider>
            <SafeEmployeeGuard>
              <EmployeePortal />
            </SafeEmployeeGuard>
          </EmployeeAuthNativeProvider>
        </EmployeeErrorBoundary>
      } />

      {/* Nova rota para resposta de avaliação no portal */}
      <Route path="/employee-portal/assessment/:assessmentId" element={
        <EmployeeErrorBoundary>
          <EmployeeAuthNativeProvider>
            <SafeEmployeeGuard>
              <AssessmentResponse />
            </SafeEmployeeGuard>
          </EmployeeAuthNativeProvider>
        </EmployeeErrorBoundary>
      } />

      {/* Avaliações públicas com tokens - sistema nativo */}
      <Route path="/avaliacao/:token" element={
        <EmployeeErrorBoundary>
          <EmployeeAuthNativeProvider>
            <PublicAssessment />
          </EmployeeAuthNativeProvider>
        </EmployeeErrorBoundary>
      } />
      
      <Route path="/assessment/:token" element={
        <EmployeeErrorBoundary>
          <EmployeeAuthNativeProvider>
            <PublicAssessment />
          </EmployeeAuthNativeProvider>
        </EmployeeErrorBoundary>
      } />

      {/* Redirecionamentos diretos sem múltiplas camadas */}
      <Route path="/portal-funcionario" element={<Navigate to="/employee-portal" replace />} />
      <Route path="/portal" element={<Navigate to="/employee-portal" replace />} />

      {/* Rotas administrativas protegidas */}
      {user && (
        <>
          <Route 
            path="/configuracoes/*" 
            element={
              <AdminGuard>
                <MainLayout>
                  <SettingsRoutes />
                </MainLayout>
              </AdminGuard>
            } 
          />
          
          <Route 
            path="/*" 
            element={
              <AdminGuard>
                <MainLayout>
                  <AdminRoutes />
                </MainLayout>
              </AdminGuard>
            } 
          />
        </>
      )}

      {/* Redirecionamento padrão simplificado */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        } 
      />
    </Routes>
  );
}
