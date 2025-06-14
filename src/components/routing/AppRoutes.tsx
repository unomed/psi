
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { SettingsRoutes } from "./SettingsRoutes";

// Import pages
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import Funcionarios from "@/pages/Funcionarios";
import Setores from "@/pages/Setores";
import Funcoes from "@/pages/Funcoes";
import Checklists from "@/pages/Checklists";
import Avaliacoes from "@/pages/Avaliacoes";
import AssessmentScheduling from "@/pages/AssessmentScheduling";
import PublicAssessment from "@/pages/PublicAssessment";
import AssessmentResults from "@/pages/AssessmentResults";
import Relatorios from "@/pages/Relatorios";
import PlanoAcao from "@/pages/PlanoAcao";
import GestaoRiscos from "@/pages/GestaoRiscos";
import Faturamento from "@/pages/Faturamento";

// Import auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Assessment Route - outside of authenticated routes */}
      <Route path="/assessment/:token" element={<PublicAssessment />} />
      
      {/* Authentication Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
      
      {/* Main authenticated routes with MainLayout */}
      <Route 
        path="/*" 
        element={
          <MainLayout>
            <Routes>
              <Route 
                path="/dashboard" 
                element={
                  <RouteGuard requirePermission="view_dashboard">
                    <Dashboard />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/empresas" 
                element={
                  <RouteGuard allowedRoles={["superadmin"]} requirePermission="view_companies">
                    <Empresas />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/funcionarios" 
                element={
                  <RouteGuard requireCompanyAccess="any" requirePermission="view_employees">
                    <Funcionarios />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/setores" 
                element={
                  <RouteGuard requireCompanyAccess="any" requirePermission="view_sectors">
                    <Setores />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/funcoes" 
                element={
                  <RouteGuard requireCompanyAccess="any" requirePermission="view_functions">
                    <Funcoes />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/templates" 
                element={
                  <RouteGuard requirePermission="view_checklists">
                    <Checklists />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/avaliacoes" 
                element={
                  <RouteGuard requireCompanyAccess="any" requirePermission="view_assessments">
                    <Avaliacoes />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/agendamentos" 
                element={
                  <RouteGuard requireCompanyAccess="any" requirePermission="view_scheduling">
                    <AssessmentScheduling />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/resultados" 
                element={
                  <RouteGuard requireCompanyAccess="any" requirePermission="view_results">
                    <AssessmentResults />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/relatorios" 
                element={
                  <RouteGuard requireCompanyAccess="any" requirePermission="view_reports">
                    <Relatorios />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/plano-acao" 
                element={
                  <RouteGuard requireCompanyAccess="any" requirePermission="view_action_plans">
                    <PlanoAcao />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/gestao-riscos" 
                element={
                  <RouteGuard requireCompanyAccess="any" requirePermission="view_risk_management">
                    <GestaoRiscos />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/faturamento" 
                element={
                  <RouteGuard allowedRoles={["superadmin"]} requirePermission="view_billing">
                    <Faturamento />
                  </RouteGuard>
                } 
              />
              <Route 
                path="/configuracoes/*" 
                element={<SettingsRoutes />} 
              />
              
              {/* Root route - redirect based on authentication */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </MainLayout>
        } 
      />
      
      {/* Fallback routes */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}
