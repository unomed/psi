
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { SettingsRoutes } from "./SettingsRoutes";
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import Funcionarios from "@/pages/Funcionarios";
import Setores from "@/pages/Setores";
import Funcoes from "@/pages/Funcoes";
import Checklists from "@/pages/Checklists";
import Avaliacoes from "@/pages/Avaliacoes";
import AssessmentScheduling from "@/pages/AssessmentScheduling";
import PublicAssessment from "@/pages/PublicAssessment";
import AssessmentResults from "@/pages/AssessmentResults";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Assessment Route - outside of authenticated routes */}
      <Route path="/assessment/:token" element={<PublicAssessment />} />
      
      {/* Main authenticated routes */}
      <Route element={<MainLayout />}>
        <Route 
          path="/dashboard" 
          element={
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          } 
        />
        <Route 
          path="/empresas" 
          element={
            <RouteGuard requiredRole="superadmin">
              <Empresas />
            </RouteGuard>
          } 
        />
        <Route 
          path="/funcionarios" 
          element={
            <RouteGuard requireCompanyAccess>
              <Funcionarios />
            </RouteGuard>
          } 
        />
        <Route 
          path="/setores" 
          element={
            <RouteGuard requireCompanyAccess>
              <Setores />
            </RouteGuard>
          } 
        />
        <Route 
          path="/funcoes" 
          element={
            <RouteGuard requireCompanyAccess>
              <Funcoes />
            </RouteGuard>
          } 
        />
        <Route 
          path="/templates" 
          element={
            <RouteGuard>
              <Checklists />
            </RouteGuard>
          } 
        />
        <Route 
          path="/avaliacoes" 
          element={
            <RouteGuard requireCompanyAccess>
              <Avaliacoes />
            </RouteGuard>
          } 
        />
        <Route 
          path="/agendamentos" 
          element={
            <RouteGuard requireCompanyAccess>
              <AssessmentScheduling />
            </RouteGuard>
          } 
        />
        <Route 
          path="/resultados" 
          element={
            <RouteGuard requireCompanyAccess>
              <AssessmentResults />
            </RouteGuard>
          } 
        />
        <Route path="/configuracoes/*" element={<SettingsRoutes />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
