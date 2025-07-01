
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import Funcionarios from "@/pages/Funcionarios";
import Funcoes from "@/pages/Funcoes";
import Setores from "@/pages/Setores";
import Checklists from "@/pages/Checklists";
import AssessmentResults from "@/pages/AssessmentResults";
import GestaoRiscos from "@/pages/GestaoRiscos";
import PlanoAcao from "@/pages/PlanoAcao";
import Relatorios from "@/pages/Relatorios";
import NR01Page from "@/pages/relatorios/NR01Page";
import Faturamento from "@/pages/Faturamento";
import AssessmentPage from "@/pages/AssessmentPage";
import AssessmentScheduling from "@/pages/AssessmentScheduling";
import CandidatosComparacao from "@/pages/CandidatosComparacao";
import CandidatosAvaliacoes from "@/pages/CandidatosAvaliacoes";

// Settings imports
import AssessmentCriteriaPage from "@/pages/configuracoes/AssessmentCriteriaPage";
import AuditoriaPage from "@/pages/configuracoes/AuditoriaPage";
import AutomacaoAvancadaPage from "@/pages/configuracoes/AutomacaoAvancadaPage";
import AutomacaoPsicossocialPage from "@/pages/configuracoes/AutomacaoPsicossocialPage";
import EmailServerPage from "@/pages/configuracoes/EmailServerPage";
import EmailTemplatesPage from "@/pages/configuracoes/EmailTemplatesPage";
import NotificationsPage from "@/pages/configuracoes/NotificationsPage";
import PeriodicityPage from "@/pages/configuracoes/PeriodicityPage";
import PermissionsPage from "@/pages/configuracoes/PermissionsPage";
import UserManagementPage from "@/pages/configuracoes/UserManagementPage";

export function AdminRoutes() {
  console.log('[AdminRoutes] Renderizando rotas administrativas');
  
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* CADASTROS - Rotas padronizadas em português */}
      <Route path="/empresas" element={<Empresas />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/funcoes" element={<Funcoes />} />
      <Route path="/setores" element={<Setores />} />
      
      {/* AVALIAÇÕES - Rotas padronizadas em português */}
      <Route path="/templates" element={<Checklists />} />
      <Route path="/resultados" element={<AssessmentResults />} />
      <Route path="/candidatos/comparacao" element={<CandidatosComparacao />} />
      <Route path="/candidatos/avaliacoes" element={<CandidatosAvaliacoes />} />
      
      {/* GESTÃO - Rotas padronizadas em português */}
      <Route path="/gestao-riscos" element={<GestaoRiscos />} />
      <Route path="/plano-acao" element={<PlanoAcao />} />
      <Route path="/agendamentos" element={<AssessmentScheduling />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/relatorios/nr01" element={<NR01Page />} />
      
      {/* PORTAIS - Rotas padronizadas em português */}
      <Route path="/faturamento" element={<Faturamento />} />
      
      {/* Rotas de assessments específicos */}
      <Route path="/assessments/:id" element={<AssessmentPage />} />
      
      {/* REDIRECTS - Rotas antigas em inglês redirecionam para as novas em português */}
      <Route path="/companies" element={<Navigate to="/empresas" replace />} />
      <Route path="/employees" element={<Navigate to="/funcionarios" replace />} />
      <Route path="/roles" element={<Navigate to="/funcoes" replace />} />
      <Route path="/sectors" element={<Navigate to="/setores" replace />} />
      <Route path="/checklists" element={<Navigate to="/templates" replace />} />
      <Route path="/assessment-results" element={<Navigate to="/resultados" replace />} />
      <Route path="/psychosocial-risks" element={<Navigate to="/gestao-riscos" replace />} />
      <Route path="/action-plans" element={<Navigate to="/plano-acao" replace />} />
      <Route path="/assessment-scheduling" element={<Navigate to="/agendamentos" replace />} />
      <Route path="/reports" element={<Navigate to="/relatorios" replace />} />
      <Route path="/billing" element={<Navigate to="/faturamento" replace />} />
      
      {/* Settings routes - mantém em português */}
      <Route path="/configuracoes/criterios-avaliacao" element={<AssessmentCriteriaPage />} />
      <Route path="/configuracoes/auditoria" element={<AuditoriaPage />} />
      <Route path="/configuracoes/automacao-avancada" element={<AutomacaoAvancadaPage />} />
      <Route path="/configuracoes/automacao-psicossocial" element={<AutomacaoPsicossocialPage />} />
      <Route path="/configuracoes/servidor-email" element={<EmailServerPage />} />
      <Route path="/configuracoes/templates-email" element={<EmailTemplatesPage />} />
      <Route path="/configuracoes/notificacoes" element={<NotificationsPage />} />
      <Route path="/configuracoes/periodicidade" element={<PeriodicityPage />} />
      <Route path="/configuracoes/permissoes" element={<PermissionsPage />} />
      <Route path="/configuracoes/usuarios" element={<UserManagementPage />} />
    </Routes>
  );
}
