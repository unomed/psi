
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRoutes } from "./AuthRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { EmployeeRoutes } from "./EmployeeRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import MainLayout from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminGuard } from "@/components/auth/AdminGuard";

export function AppRoutes() {
  const { user, loading } = useAuth();

  console.log('[AppRoutes] Estado atual:', {
    hasUser: !!user,
    loading,
    currentPath: window.location.pathname
  });

  // Loading melhorado com timeout implícito no useAuthSession
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div className="text-muted-foreground">
            <p>Verificando autenticação...</p>
            <p className="text-sm">Aguarde um momento</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rotas de autenticação para administradores - PRIORIDADE MÁXIMA */}
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />

      {/* Rotas específicas de funcionários - ISOLADAS E PRIORITÁRIAS */}
      <Route path="/auth/employee" element={<EmployeeRoutes />} />
      <Route path="/employee-portal/*" element={<EmployeeRoutes />} />
      <Route path="/avaliacao/:token" element={<EmployeeRoutes />} />
      <Route path="/assessment/:token" element={<EmployeeRoutes />} />

      {/* Rotas administrativas protegidas - APENAS PARA USUÁRIOS AUTENTICADOS */}
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

      {/* Redirecionamento padrão baseado no estado de auth */}
      <Route 
        path="*" 
        element={
          <Navigate 
            to={user ? "/dashboard" : "/auth/login"} 
            replace 
          />
        } 
      />
    </Routes>
  );
}
