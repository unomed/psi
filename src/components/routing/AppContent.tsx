
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Perfil from '@/pages/Perfil';
import Empresas from '@/pages/Empresas';
import Setores from '@/pages/Setores';
import Funcoes from '@/pages/Funcoes';
import Funcionarios from '@/pages/Funcionarios';
import Dashboard from '@/pages/Dashboard';
import Avaliacoes from '@/pages/Avaliacoes';
import Relatorios from '@/pages/Relatorios';
import PlanoAcao from '@/pages/PlanoAcao';
import GestaoRiscos from '@/pages/GestaoRiscos';
import AssessmentResults from '@/pages/AssessmentResults';
import Faturamento from '@/pages/Faturamento';
import AutomacaoGestores from '@/pages/AutomacaoGestores';
import { EmployeeDashboard } from '@/components/employee/EmployeeDashboard';
import NR01Page from '@/pages/relatorios/NR01Page';
import AutomacaoAvancadaPage from '@/pages/configuracoes/AutomacaoAvancadaPage';
import AutomacaoPsicossocialPage from '@/pages/configuracoes/AutomacaoPsicossocialPage';
import AuditoriaPage from '@/pages/configuracoes/AuditoriaPage';

export function AppContent() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/login" element={!isLoggedIn ? <Login /> : <Dashboard />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      {/* Private Routes - accessible only when logged in */}
      {isLoggedIn && (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/setores" element={<Setores />} />
          <Route path="/funcoes" element={<Funcoes />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/relatorios/nr01" element={<NR01Page />} />
          <Route path="/plano-de-acao" element={<PlanoAcao />} />
          <Route path="/gestao-de-riscos" element={<GestaoRiscos />} />
          <Route path="/assessment-results" element={<AssessmentResults />} />
          <Route path="/faturamento" element={<Faturamento />} />
          <Route path="/automacao-gestores" element={<AutomacaoGestores />} />
          <Route path="/configuracoes/automacao-avancada" element={<AutomacaoAvancadaPage />} />
          <Route path="/configuracoes/automacao-psicossocial" element={<AutomacaoPsicossocialPage />} />
          <Route path="/configuracoes/auditoria" element={<AuditoriaPage />} />
          {user?.role === 'employee' && (
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          )}
        </>
      )}
    </Routes>
  );
}
