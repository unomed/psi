
import { Route, Navigate } from "react-router-dom";
import { RouteGuard } from "@/components/auth/RouteGuard";
import MainLayout from "@/components/layout/MainLayout";
import AssessmentCriteriaPage from "@/pages/configuracoes/AssessmentCriteriaPage";
import EmailServerPage from "@/pages/configuracoes/EmailServerPage";
import EmailTemplatesPage from "@/pages/configuracoes/EmailTemplatesPage";
import EmailPage from "@/pages/configuracoes/EmailPage";
import NotificationsPage from "@/pages/configuracoes/NotificationsPage";
import PeriodicityPage from "@/pages/configuracoes/PeriodicityPage";
import UserManagementPage from "@/pages/configuracoes/UserManagementPage";
import PermissionsPage from "@/pages/configuracoes/PermissionsPage";

export const SettingsRoutes = () => {
  return (
    <>
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
      {/* Redirect /configuracoes to first settings page */}
      <Route 
        path="/configuracoes" 
        element={<Navigate to="/configuracoes/criterios" replace />} 
      />
    </>
  );
};
