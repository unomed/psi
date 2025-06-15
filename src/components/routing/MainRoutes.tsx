
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import Funcionarios from "@/pages/Funcionarios";
import Setores from "@/pages/Setores";
import Funcoes from "@/pages/Funcoes";
import Checklists from "@/pages/Checklists";
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
      {/* Rota raiz redireciona para dashboard */}
      <Route index element={<Navigate to="/dashboard" replace />} />
      
      {/* Rota específica do dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Outras rotas */}
      <Route path="/empresas" element={<Empresas />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/setores" element={<Setores />} />
      <Route path="/funcoes" element={<Funcoes />} />
      
      {/* Rotas dos templates/checklists */}
      <Route path="/templates" element={<Checklists />} />
      <Route path="/checklists" element={<Checklists />} />
      
      {/* Rotas de agendamentos */}
      <Route path="/agendamentos" element={<AssessmentScheduling />} />
      <Route path="/agendamento-avaliacoes" element={<AssessmentScheduling />} />
      
      {/* Rotas de resultados */}
      <Route path="/resultados" element={<AssessmentResults />} />
      <Route path="/assessment-results" element={<AssessmentResults />} />
      
      {/* Outras rotas existentes */}
      <Route path="/assessment/:templateId/:employeeId" element={<AssessmentPage />} />
      <Route path="/faturamento" element={<Faturamento />} />
      <Route path="/gestao-riscos" element={<GestaoRiscos />} />
      <Route path="/plano-acao" element={<PlanoAcao />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/perfil" element={<Perfil />} />
      
      {/* Catch all - redireciona para dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
