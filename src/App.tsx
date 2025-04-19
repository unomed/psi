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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth routes - public */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Protected routes - accessible by all authenticated users */}
            <Route path="/" element={
              <RouteGuard>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </RouteGuard>
            } />
            
            {/* Routes accessible only by superadmin and admin */}
            <Route path="/empresas" element={
              <RouteGuard allowedRoles={['superadmin', 'admin']}>
                <MainLayout>
                  <Empresas />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/funcionarios" element={
              <RouteGuard allowedRoles={['superadmin', 'admin']}>
                <MainLayout>
                  <Funcionarios />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/setores" element={
              <RouteGuard allowedRoles={['superadmin', 'admin']}>
                <MainLayout>
                  <Setores />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/funcoes" element={
              <RouteGuard allowedRoles={['superadmin', 'admin']}>
                <MainLayout>
                  <Funcoes />
                </MainLayout>
              </RouteGuard>
            } />
            
            {/* Routes accessible by all authenticated users */}
            <Route path="/checklists" element={
              <RouteGuard>
                <MainLayout>
                  <Checklists />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/avaliacoes" element={
              <RouteGuard>
                <MainLayout>
                  <Avaliacoes />
                </MainLayout>
              </RouteGuard>
            } />
            
            {/* Routes accessible only by superadmin and admin */}
            <Route path="/relatorios" element={
              <RouteGuard allowedRoles={['superadmin', 'admin']}>
                <MainLayout>
                  <Relatorios />
                </MainLayout>
              </RouteGuard>
            } />
            
            {/* Settings routes - accessible only by superadmin */}
            <Route path="/configuracoes/criterios" element={
              <RouteGuard allowedRoles={['superadmin']}>
                <MainLayout>
                  <AssessmentCriteriaPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/servidor-email" element={
              <RouteGuard allowedRoles={['superadmin']}>
                <MainLayout>
                  <EmailServerPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/emails" element={
              <RouteGuard allowedRoles={['superadmin']}>
                <MainLayout>
                  <EmailTemplatesPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/notificacoes" element={
              <RouteGuard allowedRoles={['superadmin']}>
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/periodicidade" element={
              <RouteGuard allowedRoles={['superadmin']}>
                <MainLayout>
                  <PeriodicityPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/permissoes" element={
              <RouteGuard allowedRoles={['superadmin']}>
                <MainLayout>
                  <PermissionsPage />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes/usuarios" element={
              <RouteGuard allowedRoles={['superadmin']}>
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
