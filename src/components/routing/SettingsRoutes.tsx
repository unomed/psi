
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PeriodicityPage from "@/pages/configuracoes/PeriodicityPage";
import EmailServerPage from "@/pages/configuracoes/EmailServerPage";
import EmailTemplatesPage from "@/pages/configuracoes/EmailTemplatesPage";
import NotificationsPage from "@/pages/configuracoes/NotificationsPage";
import PermissionsPage from "@/pages/configuracoes/PermissionsPage";
import UserManagementPage from "@/pages/configuracoes/UserManagementPage";
import AssessmentCriteriaPage from "@/pages/configuracoes/AssessmentCriteriaPage";
import AutomacaoPsicossocialPage from "@/pages/configuracoes/AutomacaoPsicossocialPage";
import AutomacaoAvancadaPage from "@/pages/configuracoes/AutomacaoAvancadaPage";
import AuditoriaPage from "@/pages/configuracoes/AuditoriaPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import UsuariosPage from "@/pages/configuracoes/UsuariosPage";

export function SettingsRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/periodicidade" element={<PeriodicityPage />} />
        <Route path="/servidor-email" element={<EmailServerPage />} />
        <Route path="/templates-email" element={<EmailTemplatesPage />} />
        <Route path="/notificacoes" element={<NotificationsPage />} />
        <Route 
          path="/permissoes" 
          element={
            <ProtectedRoute routeKey="permissions">
              <PermissionsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/usuarios" 
          element={
            <ProtectedRoute routeKey="users">
              <UsuariosPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/criterios-avaliacao" element={<AssessmentCriteriaPage />} />
        <Route path="/automacao-psicossocial" element={<AutomacaoPsicossocialPage />} />
        <Route path="/automacao-avancada" element={<AutomacaoAvancadaPage />} />
        <Route path="/auditoria" element={<AuditoriaPage />} />
      </Routes>
    </Suspense>
  );
}
