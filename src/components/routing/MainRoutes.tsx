
import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import Funcionarios from "@/pages/Funcionarios";
import Setores from "@/pages/Setores";
import Funcoes from "@/pages/Funcoes";
import Checklists from "@/pages/Checklists";
import Avaliacoes from "@/pages/Avaliacoes";
import AssessmentPage from "@/pages/AssessmentPage";
import AssessmentResults from "@/pages/AssessmentResults";
import AssessmentScheduling from "@/pages/AssessmentScheduling";
import Faturamento from "@/pages/Faturamento";
import GestaoRiscos from "@/pages/GestaoRiscos";
import PlanoAcao from "@/pages/PlanoAcao";
import Relatorios from "@/pages/Relatorios";
import Perfil from "@/pages/Perfil";
import NotFound from "@/pages/NotFound";

export function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/empresas" element={<Empresas />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/setores" element={<Setores />} />
      <Route path="/funcoes" element={<Funcoes />} />
      <Route path="/checklists" element={<Checklists />} />
      <Route path="/avaliacoes" element={<Avaliacoes />} />
      <Route path="/assessment/:templateId/:employeeId" element={<AssessmentPage />} />
      <Route path="/assessment-results" element={<AssessmentResults />} />
      <Route path="/agendamento-avaliacoes" element={<AssessmentScheduling />} />
      <Route path="/faturamento" element={<Faturamento />} />
      <Route path="/gestao-riscos" element={<GestaoRiscos />} />
      <Route path="/plano-acao" element={<PlanoAcao />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
