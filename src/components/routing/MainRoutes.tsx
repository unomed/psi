import { Routes, Route } from "react-router-dom";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { SettingsRoutes } from "./SettingsRoutes";
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

export function MainRoutes() {
  return (
    <Routes>
      <Route 
        path="/dashboard" 
        element={
          <RouteGuard>
            <Dashboard />
          </RouteGuard>
        } 
      />
      <Route 
        path="/empresas" 
        element={
          <RouteGuard allowedRoles={["superadmin"]}>
            <Empresas />
          </RouteGuard>
        } 
      />
      <Route 
        path="/funcionarios" 
        element={
          <RouteGuard requireCompanyAccess="employees">
            <Funcionarios />
          </RouteGuard>
        } 
      />
      <Route 
        path="/setores" 
        element={
          <RouteGuard requireCompanyAccess="sectors">
            <Setores />
          </RouteGuard>
        } 
      />
      <Route 
        path="/funcoes" 
        element={
          <RouteGuard requireCompanyAccess="roles">
            <Funcoes />
          </RouteGuard>
        } 
      />
      <Route 
        path="/templates" 
        element={
          <RouteGuard>
            <Checklists />
          </RouteGuard>
        } 
      />
      <Route 
        path="/avaliacoes" 
        element={
          <RouteGuard requireCompanyAccess="assessments">
            <Avaliacoes />
          </RouteGuard>
        } 
      />
      <Route 
        path="/agendamentos" 
        element={
          <RouteGuard requireCompanyAccess="scheduling">
            <AssessmentScheduling />
          </RouteGuard>
        } 
      />
      <Route 
        path="/resultados" 
        element={
          <RouteGuard requireCompanyAccess="results">
            <AssessmentResults />
          </RouteGuard>
        } 
      />
      <Route 
        path="/relatorios" 
        element={
          <RouteGuard requireCompanyAccess="results">
            <Relatorios />
          </RouteGuard>
        } 
      />
      <Route 
        path="/plano-acao" 
        element={
          <RouteGuard requireCompanyAccess="action_plans">
            <PlanoAcao />
          </RouteGuard>
        } 
      />
      <Route path="/configuracoes/*" element={<SettingsRoutes />} />
    </Routes>
  );
}
