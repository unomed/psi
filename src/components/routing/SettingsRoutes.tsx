
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

export const settingsRoutes = [
  <Route key="criterios" path="criterios" element={
    <RouteGuard requirePermission="view_settings">
      <AssessmentCriteriaPage />
    </RouteGuard>
  } />,
  <Route key="email" path="email" element={
    <RouteGuard requirePermission="view_settings">
      <EmailPage />
    </RouteGuard>
  } />,
  <Route key="email-server" path="email-server" element={
    <RouteGuard requirePermission="view_settings">
      <EmailServerPage />
    </RouteGuard>
  } />,
  <Route key="email-templates" path="email-templates" element={
    <RouteGuard requirePermission="view_settings">
      <EmailTemplatesPage />
    </RouteGuard>
  } />,
  <Route key="notificacoes" path="notificacoes" element={
    <RouteGuard requirePermission="view_settings">
      <NotificationsPage />
    </RouteGuard>
  } />,
  <Route key="periodicidade" path="periodicidade" element={
    <RouteGuard requirePermission="view_settings">
      <PeriodicityPage />
    </RouteGuard>
  } />,
  <Route key="permissoes" path="permissoes" element={
    <RouteGuard requirePermission="edit_settings">
      <PermissionsPage />
    </RouteGuard>
  } />,
  <Route key="usuarios" path="usuarios" element={
    <RouteGuard requirePermission="view_settings">
      <UserManagementPage />
    </RouteGuard>
  } />,
  <Route key="redirect" path="" element={<Navigate to="criterios" replace />} />
];
