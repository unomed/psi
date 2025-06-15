
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRoutes } from "./AuthRoutes";
import { MainRoutes } from "./MainRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import EmployeePortal from "@/pages/EmployeePortal";
import PublicAssessment from "@/pages/PublicAssessment";
import { EmployeeAuthProvider } from "@/contexts/EmployeeAuthContext";

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
      {/* Rotas públicas - não requerem autenticação */}
      <Route 
        path="/avaliacao/:token" 
        element={
          <EmployeeAuthProvider>
            <PublicAssessment />
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

      {/* Rotas de autenticação */}
      {!user && (
        <Route path="/*" element={
          <AuthLayout>
            <AuthRoutes />
          </AuthLayout>
        } />
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
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}
