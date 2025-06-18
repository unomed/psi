
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminRoutes } from "./AdminRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import MainLayout from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { EmployeeAuthNativeProvider } from "@/contexts/EmployeeAuthNative";
import PublicAssessment from "@/pages/PublicAssessment";
import ChecklistPortal from "@/pages/ChecklistPortal";
import { FormErrorBoundary } from "@/components/ui/form-error-boundary";
import { EmployeeErrorBoundary } from "@/components/ui/employee-error-boundary";
import { EmployeeLoginPage } from "@/pages/EmployeeLoginPage";
import { EmployeePortalPage } from "@/pages/EmployeePortalPage";
import Login from "@/pages/auth/Login";
import Index from "@/pages/Index";

export function AppRoutes() {
  const { user, loading } = useAuth();

  console.log('[AppRoutes] Estado atual:', {
    hasUser: !!user,
    loading,
    currentPath: window.location.pathname
  });

  // Loading melhorado
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div className="text-muted-foreground">
            <p>Verificando autenticação...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Página inicial - seletor de sistema */}
      <Route path="/" element={<Index />} />

      {/* Login administrativo */}
      <Route path="/auth/login" element={<Login />} />

      {/* Rotas de funcionários - isoladas e com contexto próprio */}
      <Route path="/auth/employee" element={
        <EmployeeErrorBoundary>
          <EmployeeAuthNativeProvider>
            <EmployeeLoginPage />
          </EmployeeAuthNativeProvider>
        </EmployeeErrorBoundary>
      } />

      <Route path="/portal" element={
        <EmployeeErrorBoundary>
          <EmployeeAuthNativeProvider>
            <EmployeePortalPage />
          </EmployeeAuthNativeProvider>
        </EmployeeErrorBoundary>
      } />

      {/* Rotas para checklist com validação */}
      <Route path="/checklist/:checklistName" element={<ChecklistPortal />} />
      <Route path="/checklist" element={<ChecklistPortal />} />

      {/* Avaliações públicas com tokens - isoladas */}
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

      {/* Redirecionamento para usuários não autenticados */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
