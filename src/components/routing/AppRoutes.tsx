
import { Routes, Route, Navigate } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

// Lazy load all pages
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Checklists = lazy(() => import("@/pages/Checklists"));
const Funcionarios = lazy(() => import("@/pages/Funcionarios"));
const Agendamentos = lazy(() => import("@/pages/Agendamentos"));
const NR01Page = lazy(() => import("@/pages/relatorios/NR01Page"));
const Configuracoes = lazy(() => import("@/pages/Configuracoes"));
const PlanoAcao = lazy(() => import("@/pages/PlanoAcao"));
const CandidatosComparacao = lazy(() => import("@/pages/CandidatosComparacao"));
const CandidatosAvaliacoes = lazy(() => import("@/pages/CandidatosAvaliacoes"));
const AssessmentResponse = lazy(() => import("@/components/assessments/AssessmentResponse"));

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
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/relatorios/nr01" element={<NR01Page />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/plano-acao" element={<PlanoAcao />} />
        <Route path="/candidatos-comparacao" element={<CandidatosComparacao />} />
        <Route path="/candidatos-avaliacoes" element={<CandidatosAvaliacoes />} />
        
        {/* Corrigido: Props corretas para AssessmentResponse */}
        <Route 
          path="/assessment/:templateId/:employeeId" 
          element={
            <AssessmentResponse 
              template_id=""
              employee_id="" 
              onComplete={() => {}} 
            />
          } 
        />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
