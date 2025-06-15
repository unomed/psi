
import { Routes, Route } from "react-router-dom";
import PeriodicityPage from "@/pages/configuracoes/PeriodicityPage";
import EmailServerPage from "@/pages/configuracoes/EmailServerPage";
import EmailTemplatesPage from "@/pages/configuracoes/EmailTemplatesPage";
import NotificationsPage from "@/pages/configuracoes/NotificationsPage";
import UserManagementPage from "@/pages/configuracoes/UserManagementPage";
import PermissionsPage from "@/pages/configuracoes/PermissionsPage";
import AssessmentCriteriaPage from "@/pages/configuracoes/AssessmentCriteriaPage";
import AutomacaoPsicossocialPage from "@/pages/configuracoes/AutomacaoPsicossocialPage";
import AutomacaoAvancadaPage from "@/pages/configuracoes/AutomacaoAvancadaPage";
import EmployeePortalPage from "@/pages/configuracoes/EmployeePortalPage";

export function SettingsRoutes() {
  return (
    <Routes>
      <Route path="/periodicidade" element={<PeriodicityPage />} />
      <Route path="/email-servidor" element={<EmailServerPage />} />
      <Route path="/email-templates" element={<EmailTemplatesPage />} />
      <Route path="/notificacoes" element={<NotificationsPage />} />
      <Route path="/usuarios" element={<UserManagementPage />} />
      <Route path="/permissoes" element={<PermissionsPage />} />
      <Route path="/criterios-avaliacao" element={<AssessmentCriteriaPage />} />
      <Route path="/automacao-psicossocial" element={<AutomacaoPsicossocialPage />} />
      <Route path="/automacao-avancada" element={<AutomacaoAvancadaPage />} />
      <Route path="/portal-funcionario" element={<EmployeePortalPage />} />
    </Routes>
  );
}
