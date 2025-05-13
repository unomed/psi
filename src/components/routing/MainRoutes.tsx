
import { Route } from "react-router-dom";
import { RouteGuard } from "@/components/auth/RouteGuard";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import Funcionarios from "@/pages/Funcionarios";
import Setores from "@/pages/Setores";
import Funcoes from "@/pages/Funcoes";
import Checklists from "@/pages/Checklists";
import Avaliacoes from "@/pages/Avaliacoes";
import Relatorios from "@/pages/Relatorios";
import GestaoRiscos from "@/pages/GestaoRiscos";
import PlanoAcao from "@/pages/PlanoAcao";
import Perfil from "@/pages/Perfil";
import AssessmentPage from "@/pages/AssessmentPage";

export const MainRoutes = () => {
  return (
    <>
      {/* Dashboard route (only accessible after login) */}
      <Route path="/dashboard" element={
        <RouteGuard>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </RouteGuard>
      } />
      
      {/* Profile page - accessible to authenticated users with specific roles */}
      <Route path="/perfil" element={
        <RouteGuard allowedRoles={['superadmin', 'admin', 'evaluator']}>
          <MainLayout>
            <Perfil />
          </MainLayout>
        </RouteGuard>
      } />
      
      {/* Routes requiring specific permissions */}
      <Route path="/empresas" element={
        <RouteGuard requirePermission="view_companies">
          <MainLayout>
            <Empresas />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/funcionarios" element={
        <RouteGuard requirePermission="view_employees">
          <MainLayout>
            <Funcionarios />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/setores" element={
        <RouteGuard requirePermission="view_sectors">
          <MainLayout>
            <Setores />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/funcoes" element={
        <RouteGuard requirePermission="view_functions">
          <MainLayout>
            <Funcoes />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/checklists" element={
        <RouteGuard requirePermission="view_checklists">
          <MainLayout>
            <Checklists />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/avaliacoes" element={
        <RouteGuard requirePermission="view_assessments">
          <MainLayout>
            <Avaliacoes />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/relatorios" element={
        <RouteGuard requirePermission="view_reports">
          <MainLayout>
            <Relatorios />
          </MainLayout>
        </RouteGuard>
      } />
      
      {/* Gestão de Riscos e Plano de Ação */}
      <Route path="/gestao-de-riscos" element={
        <RouteGuard requirePermission="view_risk_management">
          <MainLayout>
            <GestaoRiscos />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/plano-de-acao" element={
        <RouteGuard requirePermission="view_action_plan">
          <MainLayout>
            <PlanoAcao />
          </MainLayout>
        </RouteGuard>
      } />
      
      {/* Public assessment route - accessible without login */}
      <Route path="/avaliacao/:token" element={<AssessmentPage />} />
    </>
  );
};
