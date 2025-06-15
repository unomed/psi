
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

export function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

      {/* Login do funcionário envolvido por EmployeeAuthProvider para evitar erro de contexto */}
      <Route
        path="/auth/employee"
        element={
          <EmployeeAuthProvider>
            <EmployeeLogin />
          </EmployeeAuthProvider>
        }
      />

      {/* Portal do funcionário - autenticação própria */}
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

      {/* Rotas de autenticação para administradores, etc */}
      {!user && (
        <Route 
          path="/*" 
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
          <Route path="/*" element={
            <MainLayout>
              <MainRoutes />
            </MainLayout>
          } />
        </>
      )}

      {/* Redirecionamento padrão */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth/login"} replace />} />
    </Routes>
  );
}
