
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
import EmployeePortal from "@/pages/EmployeePortal";
import PublicAssessment from "@/pages/PublicAssessment";

export function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/empresas" element={<Empresas />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/funcoes" element={<Funcoes />} />
      <Route path="/setores" element={<Setores />} />
      <Route path="/checklists" element={<Checklists />} />
      <Route path="/assessment-results" element={<AssessmentResults />} />
      <Route path="/gestao-riscos" element={<GestaoRiscos />} />
      <Route path="/plano-acao" element={<PlanoAcao />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/relatorios/nr01" element={<NR01Page />} />
      <Route path="/faturamento" element={<Faturamento />} />
      <Route path="/assessments/:id" element={<AssessmentPage />} />
      <Route path="/agendamentos" element={<AssessmentScheduling />} />
      
      {/* Rotas do Portal do Funcionário */}
      <Route path="/employee-portal" element={<EmployeePortal />} />
      <Route path="/employee-portal/:templateId" element={<EmployeePortal />} />
      
      {/* Rota para avaliações públicas */}
      <Route path="/avaliacao/:token" element={<PublicAssessment />} />
    </Routes>
  );
}
