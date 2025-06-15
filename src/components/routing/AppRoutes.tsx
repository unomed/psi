
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
      {/* Rotas públicas de avaliação */}
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

      {/* Rotas diretas para avaliações por nome */}
      <Route 
        path="/:assessmentName" 
        element={
          <EmployeeAuthProvider>
            <EmployeePortal />
          </EmployeeAuthProvider>
        }
      />

      {/* Login do funcionário */}
      <Route
        path="/auth/employee"
        element={
          <EmployeeAuthProvider>
            <EmployeeLogin />
          </EmployeeAuthProvider>
        }
      />

      {/* Portal do funcionário */}
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

      {/* Rotas de autenticação para administradores */}
      {!user && (
        <Route 
          path="/auth/*" 
          element={<AuthRoutes />} 
        />
      )}

      {/* Rotas principais protegidas */}
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
