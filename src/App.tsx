
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Empresas from "./pages/Empresas";
import Funcionarios from "./pages/Funcionarios";
import Setores from "./pages/Setores";
import Funcoes from "./pages/Funcoes";
import Checklists from "./pages/Checklists";
import Avaliacoes from "./pages/Avaliacoes";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";
import AssessmentPage from "./pages/AssessmentPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthProvider } from "./contexts/AuthContext";
import { RouteGuard } from "./components/auth/RouteGuard";
import AssessmentCriteriaPage from "./pages/configuracoes/AssessmentCriteriaPage";
import EmailServerPage from "./pages/configuracoes/EmailServerPage";
import EmailTemplatesPage from "./pages/configuracoes/EmailTemplatesPage";
import NotificationsPage from "./pages/configuracoes/NotificationsPage";
import PeriodicityPage from "./pages/configuracoes/PeriodicityPage";
import UserManagementPage from "./pages/configuracoes/UserManagementPage";
import PermissionsPage from "./pages/configuracoes/PermissionsPage";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Home route - public with redirection logic */}
            <Route path="/" element={<Index />} />
            
            {/* Auth routes - public */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Dashboard route */}
            <Route path="/dashboard" element={
              <RouteGuard>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </RouteGuard>
            } />
            
            {/* Routes requiring specific permissions */}
            <Route path="/empresas" element={
              <RouteGuard requirePermission="view_companies">
                <MainLayout>
                  <Empresas />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/funcionarios" element={
              <RouteGuard requirePermission="view_employees">
                <MainLayout>
                  <Funcionarios />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/setores" element={
              <RouteGuard requirePermission="view_sectors">
                <MainLayout>
                  <Setores />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/funcoes" element={
              <RouteGuard requirePermission="view_functions">
                <MainLayout>
                  <Funcoes />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/checklists" element={
              <RouteGuard requirePermission="view_checklists">
                <MainLayout>
                  <Checklists />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/avaliacoes" element={
              <RouteGuard requirePermission="view_assessments">
                <MainLayout>
                  <Avaliacoes />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/relatorios" element={
              <RouteGuard requirePermission="view_reports">
                <MainLayout>
                  <Relatorios />
                </MainLayout>
              </RouteGuard>
            } />
            
            {/* Settings routes - require view_settings permission */}
            <Route path="/configuracoes/criterios" element={
              <RouteGuard requirePermission="view_settings">
                <MainLayout>
                  <AssessmentCriteriaPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/servidor-email" element={
              <RouteGuard requirePermission="view_settings">
                <MainLayout>
                  <EmailServerPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/emails" element={
              <RouteGuard requirePermission="view_settings">
                <MainLayout>
                  <EmailTemplatesPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/notificacoes" element={
              <RouteGuard requirePermission="view_settings">
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/periodicidade" element={
              <RouteGuard requirePermission="view_settings">
                <MainLayout>
                  <PeriodicityPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/permissoes" element={
              <RouteGuard requirePermission="edit_settings">
                <MainLayout>
                  <PermissionsPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/usuarios" element={
              <RouteGuard requirePermission="view_settings">
                <MainLayout>
                  <UserManagementPage />
                </MainLayout>
              </RouteGuard>
            } />
            
            {/* Redirect /configuracoes to first settings page */}
            <Route 
              path="/configuracoes" 
              element={<Navigate to="/configuracoes/criterios" replace />} 
            />
            
            {/* Public assessment route - accessible without login */}
            <Route path="/avaliacao/:token" element={<AssessmentPage />} />

            {/* Redirect root to auth */}
            <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
