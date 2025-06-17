
import { Routes, Route } from "react-router-dom";
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
      
      {/* CADASTROS - Rotas padronizadas */}
      <Route path="/empresas" element={<Empresas />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/funcoes" element={<Funcoes />} />
      <Route path="/setores" element={<Setores />} />
      
      {/* AVALIAÇÕES - Rotas padronizadas */}
      <Route path="/templates" element={<Checklists />} />
      <Route path="/resultados" element={<AssessmentResults />} />
      <Route path="/candidatos/comparacao" element={<CandidatosComparacao />} />
      <Route path="/candidatos/avaliacoes" element={<CandidatosAvaliacoes />} />
      
      {/* GESTÃO - Rotas padronizadas */}
      <Route path="/gestao-riscos" element={<GestaoRiscos />} />
      <Route path="/plano-acao" element={<PlanoAcao />} />
      <Route path="/agendamentos" element={<AssessmentScheduling />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/relatorios/nr01" element={<NR01Page />} />
      
      {/* PORTAIS */}
      <Route path="/faturamento" element={<Faturamento />} />
      
      {/* Rotas de assessments específicos */}
      <Route path="/assessments/:id" element={<AssessmentPage />} />
      
      {/* BACKWARD COMPATIBILITY - Rotas antigas redirecionam */}
      <Route path="/companies" element={<Empresas />} />
      <Route path="/employees" element={<Funcionarios />} />
      <Route path="/roles" element={<Funcoes />} />
      <Route path="/sectors" element={<Setores />} />
      <Route path="/checklists" element={<Checklists />} />
      <Route path="/assessment-results" element={<AssessmentResults />} />
      <Route path="/psychosocial-risks" element={<GestaoRiscos />} />
      <Route path="/action-plans" element={<PlanoAcao />} />
      <Route path="/assessment-scheduling" element={<AssessmentScheduling />} />
      <Route path="/reports" element={<Relatorios />} />
      <Route path="/billing" element={<Faturamento />} />
      
      {/* Settings routes */}
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
