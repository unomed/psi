
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

// DEPRECATED: Use AdminRoutes instead
// Esta função é mantida apenas para compatibilidade, mas deve usar AdminRoutes
export function MainRoutes() {
  console.log('[MainRoutes] DEPRECATED - Use AdminRoutes instead');
  
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/empresas" element={<Empresas />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/funcoes" element={<Funcoes />} />
      <Route path="/setores" element={<Setores />} />
      <Route path="/checklists" element={<Checklists />} />
      <Route path="/templates" element={<Checklists />} />
      <Route path="/assessment-results" element={<AssessmentResults />} />
      <Route path="/resultados" element={<AssessmentResults />} />
      <Route path="/gestao-riscos" element={<GestaoRiscos />} />
      <Route path="/plano-acao" element={<PlanoAcao />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/relatorios/nr01" element={<NR01Page />} />
      <Route path="/faturamento" element={<Faturamento />} />
      <Route path="/assessments/:id" element={<AssessmentPage />} />
      <Route path="/agendamentos" element={<AssessmentScheduling />} />
    </Routes>
  );
}
