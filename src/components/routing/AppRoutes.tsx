
import { Routes, Route, Navigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

// Lazy load all pages
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Checklists = lazy(() => import("@/pages/Checklists"));
const Funcionarios = lazy(() => import("@/pages/Funcionarios"));
const AssessmentScheduling = lazy(() => import("@/pages/AssessmentScheduling"));
const NR01Page = lazy(() => import("@/pages/relatorios/NR01Page"));
const PlanoAcao = lazy(() => import("@/pages/PlanoAcao"));
const CandidatosComparacao = lazy(() => import("@/pages/CandidatosComparacao"));
const CandidatosAvaliacoes = lazy(() => import("@/pages/CandidatosAvaliacoes"));

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
        <Route path="/checklists" element={<Checklists />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/agendamentos" element={<AssessmentScheduling />} />
        <Route path="/relatorios/nr01" element={<NR01Page />} />
        <Route path="/plano-acao" element={<PlanoAcao />} />
        <Route path="/candidatos-comparacao" element={<CandidatosComparacao />} />
        <Route path="/candidatos-avaliacoes" element={<CandidatosAvaliacoes />} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
