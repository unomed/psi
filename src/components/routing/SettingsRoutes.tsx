
import { Routes, Route } from "react-router-dom";
import NotificationsPage from "@/pages/configuracoes/NotificationsPage";
import EmailPage from "@/pages/configuracoes/EmailPage";
import AutomacaoPsicossocialPage from "@/pages/configuracoes/AutomacaoPsicossocialPage";
import NR01Page from "@/pages/relatorios/NR01Page";

export function SettingsRoutes() {
  return (
    <Routes>
      <Route path="notificacoes" element={<NotificationsPage />} />
      <Route path="email" element={<EmailPage />} />
      <Route path="automacao-psicossocial" element={<AutomacaoPsicossocialPage />} />
      <Route path="relatorios-nr01" element={<NR01Page />} />
    </Routes>
  );
}
