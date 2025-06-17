
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRoutes } from "./AuthRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import MainLayout from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { EmployeeGuard } from "@/components/auth/EmployeeGuard";
import { EmployeeAuthProvider } from "@/contexts/EmployeeAuthContext";
import EmployeePortal from "@/pages/EmployeePortal";
import PublicAssessment from "@/pages/PublicAssessment";
import EmployeeLogin from "@/pages/auth/EmployeeLogin";
import ChecklistPortal from "@/pages/ChecklistPortal";
import { FormErrorBoundary } from "@/components/ui/form-error-boundary";

export function AppRoutes() {
  const { user, loading } = useAuth();

  console.log('[AppRoutes] Estado atual:', {
    hasUser: !!user,
    loading,
    currentPath: window.location.pathname
  });

  // Loading melhorado com detecção de problemas
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
      {/* Rotas de autenticação - PRIORIDADE MÁXIMA com Error Boundary */}
      <Route path="/auth/*" element={
        <FormErrorBoundary>
          <AuthRoutes />
        </FormErrorBoundary>
      } />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />

      {/* Nova rota para checklist com validação */}
      <Route path="/checklist/:checklistName" element={<ChecklistPortal />} />
      <Route path="/checklist" element={<ChecklistPortal />} />

      {/* Rotas do portal do funcionário - COMPLETAMENTE ISOLADAS */}
      <Route path="/auth/employee" element={
        <FormErrorBoundary>
          <EmployeeAuthProvider>
            <EmployeeLogin />
          </EmployeeAuthProvider>
        </FormErrorBoundary>
      } />
      
      <Route path="/employee-portal" element={
        <EmployeeAuthProvider>
          <EmployeeGuard>
            <EmployeePortal />
          </EmployeeGuard>
        </EmployeeAuthProvider>
      } />
      
      <Route path="/employee-portal/:templateId" element={
        <EmployeeAuthProvider>
          <EmployeeGuard>
            <EmployeePortal />
          </EmployeeGuard>
        </EmployeeAuthProvider>
      } />

      {/* Avaliações públicas com tokens - isoladas */}
      <Route path="/avaliacao/:token" element={
        <EmployeeAuthProvider>
          <PublicAssessment />
        </EmployeeAuthProvider>
      } />
      
      <Route path="/assessment/:token" element={
        <EmployeeAuthProvider>
          <PublicAssessment />
        </EmployeeAuthProvider>
      } />

      {/* Redirecionamento do portal do funcionário */}
      <Route path="/portal-funcionario" element={<Navigate to="/employee-portal" replace />} />

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

      {/* Redirecionamento padrão corrigido para não interferir com rotas de funcionário */}
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
