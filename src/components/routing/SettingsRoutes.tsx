
import { Routes, Route } from "react-router-dom";
import NotificationsPage from "@/pages/configuracoes/NotificationsPage";
import EmailPage from "@/pages/configuracoes/EmailPage";
import AutomacaoPsicossocialPage from "@/pages/configuracoes/AutomacaoPsicossocialPage";
import NR01Page from "@/pages/relatorios/NR01Page";
import UsuariosPage from "@/pages/configuracoes/UsuariosPage";
import PermissionsPage from "@/pages/configuracoes/PermissionsPage";

export function SettingsRoutes() {
  return (
    <Routes>
      <Route path="notificacoes" element={<NotificationsPage />} />
      <Route path="email" element={<EmailPage />} />
      <Route path="automacao-psicossocial" element={<AutomacaoPsicossocialPage />} />
      <Route path="automacao" element={<AutomacaoPsicossocialPage />} />
      <Route path="relatorios-nr01" element={<NR01Page />} />
      <Route path="usuarios" element={<UsuariosPage />} />
      <Route path="permissoes" element={<PermissionsPage />} />
    </Routes>
  );
}
