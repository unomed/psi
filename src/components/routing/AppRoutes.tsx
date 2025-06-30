
import { Routes, Route, Navigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

// Lazy load all pages
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Empresas = lazy(() => import("@/pages/Empresas"));
const Funcionarios = lazy(() => import("@/pages/Funcionarios"));
const Funcoes = lazy(() => import("@/pages/Funcoes"));
const Setores = lazy(() => import("@/pages/Setores"));
const Checklists = lazy(() => import("@/pages/Checklists"));
const AssessmentResults = lazy(() => import("@/pages/AssessmentResults"));
const AssessmentScheduling = lazy(() => import("@/pages/AssessmentScheduling"));
const PlanoAcao = lazy(() => import("@/pages/PlanoAcao"));
const GestaoRiscos = lazy(() => import("@/pages/GestaoRiscos"));
const Faturamento = lazy(() => import("@/pages/Faturamento"));
const CandidatosComparacao = lazy(() => import("@/pages/CandidatosComparacao"));
const CandidatosAvaliacoes = lazy(() => import("@/pages/CandidatosAvaliacoes"));
const NR01Page = lazy(() => import("@/pages/relatorios/NR01Page"));

export function AppRoutes() {
  const { isAuthenticated } = useSimpleAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Cadastros */}
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/funcoes" element={<Funcoes />} />
        <Route path="/setores" element={<Setores />} />
        
        {/* Avaliações */}
        <Route path="/templates" element={<Checklists />} />
        <Route path="/checklists" element={<Checklists />} />
        <Route path="/resultados" element={<AssessmentResults />} />
        <Route path="/candidatos/comparacao" element={<CandidatosComparacao />} />
        <Route path="/candidatos/avaliacoes" element={<CandidatosAvaliacoes />} />
        
        {/* Gestão */}
        <Route path="/gestao-riscos" element={<GestaoRiscos />} />
        <Route path="/plano-acao" element={<PlanoAcao />} />
        <Route path="/agendamentos" element={<AssessmentScheduling />} />
        <Route path="/relatorios" element={<NR01Page />} />
        <Route path="/relatorios/nr01" element={<NR01Page />} />
        
        {/* Portais */}
        <Route path="/faturamento" element={<Faturamento />} />
        
        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
