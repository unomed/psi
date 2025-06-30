
import { Routes, Route } from "react-router-dom";
import { useParams } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import Funcionarios from "@/pages/Funcionarios";
import Setores from "@/pages/Setores";
import NR01Page from "@/pages/relatorios/NR01Page";
import AutomacaoAvancadaPage from "@/pages/configuracoes/AutomacaoAvancadaPage";
import { AssessmentResponse } from "@/components/employee/AssessmentResponse";
import NotFound from "@/pages/NotFound";

// Importar APENAS versões simplificadas para TODAS as páginas com problemas
import FuncoesSimplified from "@/pages/FuncoesSimplified";
import ChecklistsSimplified from "@/pages/ChecklistsSimplified";
import AvaliacoesSimplified from "@/pages/AvaliacoesSimplified";
import RelatoriosSimplified from "@/pages/RelatoriosSimplified";
import PlanoAcaoSimplified from "@/pages/PlanoAcaoSimplified";
import GestaoRiscosSimplified from "@/pages/GestaoRiscosSimplified";
import ResultadosSimplified from "@/pages/ResultadosSimplified";
import AgendamentosSimplified from "@/pages/AgendamentosSimplified";
import FaturamentoSimplified from "@/pages/FaturamentoSimplified";
import PerfilSimplified from "@/pages/PerfilSimplified";
import AutomacaoGestoresSimplified from "@/pages/AutomacaoGestoresSimplified";
import CandidatosSimplified from "@/pages/CandidatosSimplified";

function AssessmentResponseWrapper() {
  const { templateId, employeeId } = useParams();
  
  if (!templateId || !employeeId) {
    return <NotFound />;
  }

  return (
    <AssessmentResponse
      templateId={templateId}
      employeeId={employeeId}
      onComplete={() => window.close()}
    />
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Páginas FUNCIONAIS - mantidas */}
      <Route path="/empresas" element={<Empresas />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/setores" element={<Setores />} />
      
      {/* TODAS as outras páginas usam versões simplificadas */}
      <Route path="/funcoes" element={<FuncoesSimplified />} />
      <Route path="/templates" element={<ChecklistsSimplified />} />
      <Route path="/checklists" element={<ChecklistsSimplified />} />
      <Route path="/avaliacoes" element={<AvaliacoesSimplified />} />
      <Route path="/candidatos/avaliacoes" element={<CandidatosSimplified />} />
      <Route path="/candidatos/comparacao" element={<CandidatosSimplified />} />
      <Route path="/resultados" element={<ResultadosSimplified />} />
      <Route path="/agendamentos" element={<AgendamentosSimplified />} />
      <Route path="/agendamento-avaliacoes" element={<AgendamentosSimplified />} />
      <Route path="/resultados-avaliacoes" element={<ResultadosSimplified />} />
      <Route path="/relatorios" element={<RelatoriosSimplified />} />
      <Route path="/plano-acao" element={<PlanoAcaoSimplified />} />
      <Route path="/gestao-riscos" element={<GestaoRiscosSimplified />} />
      <Route path="/automacao-gestores" element={<AutomacaoGestoresSimplified />} />
      <Route path="/faturamento" element={<FaturamentoSimplified />} />
      <Route path="/perfil" element={<PerfilSimplified />} />
      
      {/* Páginas específicas que funcionam */}
      <Route path="/relatorios/nr01" element={<NR01Page />} />
      <Route path="/configuracoes/automacao-avancada" element={<AutomacaoAvancadaPage />} />
      
      {/* Rotas de avaliação - simplificadas por enquanto */}
      <Route path="/assessment/:templateId/:employeeId" element={<AssessmentResponseWrapper />} />
      
      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
