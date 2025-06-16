
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRoutes } from "./AuthRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { EmployeeRoutes } from "./EmployeeRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import MainLayout from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { useMemo } from "react";

// Função para determinar se a rota é de funcionário
const isEmployeeRoute = (pathname: string): boolean => {
  const employeePatterns = [
    '/employee-portal',
    '/portal-funcionario',
    '/auth/employee',
    '/avaliacao/',
    '/assessment/'
  ];
  
  return employeePatterns.some(pattern => pathname.startsWith(pattern));
};

export function AppRoutes() {
  const { user, loading } = useAuth();
  const currentPath = window.location.pathname;

  console.log('[AppRoutes] Estado atual:', {
    hasUser: !!user,
    loading,
    currentPath,
    isEmployeeRoute: isEmployeeRoute(currentPath)
  });

  // Memoizar verificação de rota de funcionário
  const isCurrentRouteEmployee = useMemo(() => 
    isEmployeeRoute(currentPath), 
    [currentPath]
  );

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

  // Se é rota de funcionário, usar apenas EmployeeRoutes
  if (isCurrentRouteEmployee) {
    console.log('[AppRoutes] Rota de funcionário detectada, usando EmployeeRoutes');
    return <EmployeeRoutes />;
  }

  return (
    <Routes>
      {/* Rotas de autenticação - PRIORIDADE MÁXIMA */}
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />

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

      {/* Redirecionamento padrão melhorado */}
      <Route 
        path="*" 
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
