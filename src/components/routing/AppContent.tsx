
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import Funcionarios from "@/pages/Funcionarios";
import Funcoes from "@/pages/Funcoes";
import Setores from "@/pages/Setores";
import Checklists from "@/pages/Checklists";
import Avaliacoes from "@/pages/Avaliacoes";
import PlanoAcao from "@/pages/PlanoAcao";
import Faturamento from "@/pages/Faturamento";
import AssessmentScheduling from "@/pages/AssessmentScheduling";
import AssessmentResults from "@/pages/AssessmentResults";
import GestaoRiscos from "@/pages/GestaoRiscos";
import AutomacaoGestores from "@/pages/AutomacaoGestores";
import CandidatosAvaliacoes from "@/pages/CandidatosAvaliacoes";
import CandidatosComparacao from "@/pages/CandidatosComparacao";
import Perfil from "@/pages/Perfil";
import { EmployeeDashboard } from "@/components/employee/EmployeeDashboard";
import NotFound from "@/pages/NotFound";

export function AppContent() {
  const { user } = useAuth();

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
      <Route path="/plano-acao" element={<PlanoAcao />} />
      <Route path="/faturamento" element={<Faturamento />} />
      <Route path="/gestao-riscos" element={<GestaoRiscos />} />
      <Route path="/automacao-gestores" element={<AutomacaoGestores />} />
      <Route path="/candidatos-avaliacoes" element={<CandidatosAvaliacoes />} />
      <Route path="/candidatos-comparacao" element={<CandidatosComparacao />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route 
        path="/funcionario-dashboard" 
        element={<EmployeeDashboard employeeId={user?.id || ''} />} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
