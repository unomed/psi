
import { Routes, Route, Navigate } from "react-router-dom";
import { RouteGuard } from "@/components/auth/RouteGuard";
import MainLayout from "@/components/layout/MainLayout";
import NotFound from "@/pages/NotFound";

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Main pages
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

// Settings pages
import AssessmentCriteriaPage from "@/pages/configuracoes/AssessmentCriteriaPage";
import EmailServerPage from "@/pages/configuracoes/EmailServerPage";
import EmailTemplatesPage from "@/pages/configuracoes/EmailTemplatesPage";
import EmailPage from "@/pages/configuracoes/EmailPage";
import NotificationsPage from "@/pages/configuracoes/NotificationsPage";
import PeriodicityPage from "@/pages/configuracoes/PeriodicityPage";
import UserManagementPage from "@/pages/configuracoes/UserManagementPage";
import PermissionsPage from "@/pages/configuracoes/PermissionsPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Home route redirects to login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      
      {/* Auth routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
      
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
      
      {/* Settings routes */}
      <Route path="/configuracoes/criterios" element={
        <RouteGuard requirePermission="view_settings">
          <MainLayout>
            <AssessmentCriteriaPage />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/configuracoes/email" element={
        <RouteGuard requirePermission="view_settings">
          <MainLayout>
            <EmailPage />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/configuracoes/servidor-email" element={
        <RouteGuard requirePermission="view_settings">
          <MainLayout>
            <EmailServerPage />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/configuracoes/emails" element={
        <RouteGuard requirePermission="view_settings">
          <MainLayout>
            <EmailTemplatesPage />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/configuracoes/notificacoes" element={
        <RouteGuard requirePermission="view_settings">
          <MainLayout>
            <NotificationsPage />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/configuracoes/periodicidade" element={
        <RouteGuard requirePermission="view_settings">
          <MainLayout>
            <PeriodicityPage />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/configuracoes/permissoes" element={
        <RouteGuard requirePermission="edit_settings">
          <MainLayout>
            <PermissionsPage />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/configuracoes/usuarios" element={
        <RouteGuard requirePermission="view_settings">
          <MainLayout>
            <UserManagementPage />
          </MainLayout>
        </RouteGuard>
      } />
      <Route path="/configuracoes" element={<Navigate to="/configuracoes/criterios" replace />} />
      
      {/* Public assessment route - accessible without login */}
      <Route path="/avaliacao/:token" element={<AssessmentPage />} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
