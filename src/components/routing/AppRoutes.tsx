
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRoutes } from "./AuthRoutes";
import { MainRoutes } from "./MainRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import MainLayout from "@/components/layout/MainLayout";
import EmployeePortal from "@/pages/EmployeePortal";
import PublicAssessment from "@/pages/PublicAssessment";
import { EmployeeAuthProvider } from "@/contexts/EmployeeAuthContext";
import EmployeeLogin from "@/pages/auth/EmployeeLogin";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
      {/* Rotas de autenticação para administradores - deve vir ANTES das rotas genéricas */}
      {!user && (
        <Route 
          path="/auth/*" 
          element={<AuthRoutes />} 
        />
      )}

      {/* Rotas específicas de funcionários - com prefixos claros */}
      <Route
        path="/auth/employee"
        element={
          <EmployeeAuthProvider>
            <EmployeeLogin />
          </EmployeeAuthProvider>
        }
      />

      <Route 
        path="/employee-portal/*" 
        element={
          <EmployeeAuthProvider>
            <Routes>
              <Route path="/" element={<EmployeePortal />} />
              <Route path="/:templateId" element={<EmployeePortal />} />
            </Routes>
          </EmployeeAuthProvider>
        } 
      />

      {/* Rotas públicas de avaliação com tokens específicos */}
      <Route 
        path="/avaliacao/:token" 
        element={
          <EmployeeAuthProvider>
            <PublicAssessment />
          </EmployeeAuthProvider>
        }
      />
      <Route 
        path="/assessment/:token" 
        element={
          <EmployeeAuthProvider>
            <PublicAssessment />
          </EmployeeAuthProvider>
        }
      />

      {/* Rotas principais protegidas para usuários administrativos */}
      {user && (
        <>
          <Route path="/configuracoes/*" element={
            <MainLayout>
              <SettingsRoutes />
            </MainLayout>
          } />
          
          {/* Todas as rotas protegidas usando MainLayout */}
          <Route path="/*" element={
            <MainLayout>
              <MainRoutes />
            </MainLayout>
          } />
        </>
      )}

      {/* Rotas dinâmicas por nome de avaliação - DEVE SER A ÚLTIMA */}
      <Route 
        path="/:assessmentName" 
        element={
          <EmployeeAuthProvider>
            <EmployeePortal />
          </EmployeeAuthProvider>
        }
      />

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
