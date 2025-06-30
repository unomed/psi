
import { Routes, Route } from "react-router-dom";
import { useParams } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import Funcionarios from "@/pages/Funcionarios";
import Funcoes from "@/pages/Funcoes";
import Setores from "@/pages/Setores";
import Checklists from "@/pages/Checklists";
import Avaliacoes from "@/pages/Avaliacoes";
import Relatorios from "@/pages/Relatorios";
import PlanoAcao from "@/pages/PlanoAcao";
import Faturamento from "@/pages/Faturamento";
import AssessmentScheduling from "@/pages/AssessmentScheduling";
import AssessmentResults from "@/pages/AssessmentResults";
import GestaoRiscos from "@/pages/GestaoRiscos";
import AutomacaoGestores from "@/pages/AutomacaoGestores";
import CandidatosAvaliacoes from "@/pages/CandidatosAvaliacoes";
import CandidatosComparacao from "@/pages/CandidatosComparacao";
import Perfil from "@/pages/Perfil";
import { AssessmentResponse } from "@/components/employee/AssessmentResponse";
import NotFound from "@/pages/NotFound";

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
      <Route path="/empresas" element={<Empresas />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/funcoes" element={<Funcoes />} />
      <Route path="/setores" element={<Setores />} />
      <Route path="/checklists" element={<Checklists />} />
      <Route path="/avaliacoes" element={<Avaliacoes />} />
      <Route path="/agendamento-avaliacoes" element={<AssessmentScheduling />} />
      <Route path="/resultados-avaliacoes" element={<AssessmentResults />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/plano-acao" element={<PlanoAcao />} />
      <Route path="/faturamento" element={<Faturamento />} />
      <Route path="/gestao-riscos" element={<GestaoRiscos />} />
      <Route path="/automacao-gestores" element={<AutomacaoGestores />} />
      <Route path="/candidatos-avaliacoes" element={<CandidatosAvaliacoes />} />
      <Route path="/candidatos-comparacao" element={<CandidatosComparacao />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/assessment/:templateId/:employeeId" element={<AssessmentResponseWrapper />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
