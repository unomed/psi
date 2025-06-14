
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { settingsRoutes } from "./SettingsRoutes";

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
import PlanoAcaoV2 from "@/pages/PlanoAcaoV2";
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
        path="/dashboard" 
        element={
          <MainLayout>
            <RouteGuard requirePermission="view_dashboard">
              <Dashboard />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/empresas" 
        element={
          <MainLayout>
            <RouteGuard allowedRoles={["superadmin"]} requirePermission="view_companies">
              <Empresas />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/funcionarios" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="any" requirePermission="view_employees">
              <Funcionarios />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/setores" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="any" requirePermission="view_sectors">
              <Setores />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/funcoes" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="any" requirePermission="view_functions">
              <Funcoes />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/templates" 
        element={
          <MainLayout>
            <RouteGuard requirePermission="view_checklists">
              <Checklists />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/avaliacoes" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="any" requirePermission="view_assessments">
              <Avaliacoes />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/agendamentos" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="any" requirePermission="view_scheduling">
              <AssessmentScheduling />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/resultados" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="any" requirePermission="view_results">
              <AssessmentResults />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/relatorios" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="any" requirePermission="view_reports">
              <Relatorios />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/plano-acao" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="any" requirePermission="view_action_plans">
              <PlanoAcaoV2 />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/gestao-riscos" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="any" requirePermission="view_risk_management">
              <GestaoRiscos />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/faturamento" 
        element={
          <MainLayout>
            <RouteGuard allowedRoles={["superadmin"]} requirePermission="view_billing">
              <Faturamento />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/configuracoes/*" 
        element={
          <MainLayout>
            <Routes>
              {settingsRoutes}
            </Routes>
          </MainLayout>
        } 
      />
      
      {/* Root route - redirect based on authentication */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}
