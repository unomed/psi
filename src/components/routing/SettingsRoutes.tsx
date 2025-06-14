
import { Route, Navigate } from "react-router-dom";
import { RouteGuard } from "@/components/auth/RouteGuard";
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
      <Route path="criterios" element={
        <RouteGuard requirePermission="view_settings">
          <AssessmentCriteriaPage />
        </RouteGuard>
      } />
      <Route path="email" element={
        <RouteGuard requirePermission="view_settings">
          <EmailPage />
        </RouteGuard>
      } />
      <Route path="servidor-email" element={
        <RouteGuard requirePermission="view_settings">
          <EmailServerPage />
        </RouteGuard>
      } />
      <Route path="emails" element={
        <RouteGuard requirePermission="view_settings">
          <EmailTemplatesPage />
        </RouteGuard>
      } />
      <Route path="notificacoes" element={
        <RouteGuard requirePermission="view_settings">
          <NotificationsPage />
        </RouteGuard>
      } />
      <Route path="periodicidade" element={
        <RouteGuard requirePermission="view_settings">
          <PeriodicityPage />
        </RouteGuard>
      } />
      <Route path="permissoes" element={
        <RouteGuard requirePermission="edit_settings">
          <PermissionsPage />
        </RouteGuard>
      } />
      <Route path="usuarios" element={
        <RouteGuard requirePermission="view_settings">
          <UserManagementPage />
        </RouteGuard>
      } />
      {/* Redirect /configuracoes to first settings page */}
      <Route 
        path="" 
        element={<Navigate to="criterios" replace />} 
      />
    </>
  );
};
