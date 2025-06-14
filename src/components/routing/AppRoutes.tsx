
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { settingsRoutes } from "./SettingsRoutes";
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

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Assessment Route - outside of authenticated routes */}
      <Route path="/assessment/:token" element={<PublicAssessment />} />
      
      {/* Main authenticated routes with MainLayout */}
      <Route 
        path="/dashboard" 
        element={
          <MainLayout>
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/empresas" 
        element={
          <MainLayout>
            <RouteGuard allowedRoles={["superadmin"]}>
              <Empresas />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/funcionarios" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="employees">
              <Funcionarios />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/setores" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="sectors">
              <Setores />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/funcoes" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="roles">
              <Funcoes />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/templates" 
        element={
          <MainLayout>
            <RouteGuard>
              <Checklists />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/avaliacoes" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="assessments">
              <Avaliacoes />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/agendamentos" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="scheduling">
              <AssessmentScheduling />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/resultados" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="results">
              <AssessmentResults />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/relatorios" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="results">
              <Relatorios />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/plano-acao" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="action_plans">
              <PlanoAcao />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/gestao-riscos" 
        element={
          <MainLayout>
            <RouteGuard requireCompanyAccess="risk_management">
              <GestaoRiscos />
            </RouteGuard>
          </MainLayout>
        } 
      />
      <Route 
        path="/faturamento" 
        element={
          <MainLayout>
            <RouteGuard allowedRoles={["superadmin"]}>
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
      
      {/* Fallback routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
