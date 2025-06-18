
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
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";
import Login from "@/pages/auth/Login";
import Index from "@/pages/Index";

// Componente para rotas de funcionários
function EmployeeRoutes() {
  const { session, loading } = useEmployeeAuthNative();

  console.log('[EmployeeRoutes] Estado funcionário:', {
    hasSession: !!session,
    isAuthenticated: session?.isAuthenticated,
    loading
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Carregando Portal do Funcionário...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {!session?.isAuthenticated ? (
        <>
          <Route path="/auth/employee" element={<EmployeeLoginPage />} />
          <Route path="/*" element={<Navigate to="/auth/employee" replace />} />
        </>
      ) : (
        <>
          <Route path="/portal" element={<EmployeePortalPage />} />
          <Route path="/*" element={<Navigate to="/portal" replace />} />
        </>
      )}
    </Routes>
  );
}

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

      {/* Rotas de funcionários - isoladas e simples */}
      <Route path="/employee/*" element={
        <EmployeeErrorBoundary>
          <EmployeeAuthNativeProvider>
            <EmployeeRoutes />
          </EmployeeAuthNativeProvider>
        </EmployeeErrorBoundary>
      } />
      
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

      {/* Nova rota para checklist com validação */}
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

      {/* Login administrativo */}
      <Route path="/auth/login" element={<Login />} />

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
