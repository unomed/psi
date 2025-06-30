
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
import NR01Page from "@/pages/relatorios/NR01Page";
import Faturamento from "@/pages/Faturamento";
import AssessmentPage from "@/pages/AssessmentPage";
import AssessmentScheduling from "@/pages/AssessmentScheduling";
import CandidatosComparacao from "@/pages/CandidatosComparacao";
import CandidatosAvaliacoes from "@/pages/CandidatosAvaliacoes";

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
      <Route path="/relatorios/nr01" element={<NR01Page />} />
      
      {/* PORTAIS - Rotas padronizadas em português */}
      <Route path="/faturamento" element={<Faturamento />} />
      
      {/* Rotas de assessments específicos */}
      <Route path="/assessments/:id" element={<AssessmentPage />} />
      
      {/* REDIRECTS SIMPLIFICADOS - Apenas os essenciais */}
      <Route path="/companies" element={<Navigate to="/empresas" replace />} />
      <Route path="/employees" element={<Navigate to="/funcionarios" replace />} />
      <Route path="/checklists" element={<Navigate to="/templates" replace />} />
      <Route path="/assessment-results" element={<Navigate to="/resultados" replace />} />
      <Route path="/psychosocial-risks" element={<Navigate to="/gestao-riscos" replace />} />
      <Route path="/action-plans" element={<Navigate to="/plano-acao" replace />} />
      <Route path="/assessment-scheduling" element={<Navigate to="/agendamentos" replace />} />
      <Route path="/billing" element={<Navigate to="/faturamento" replace />} />
    </Routes>
  );
}
