
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
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import AssessmentPage from "./pages/AssessmentPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthProvider } from "./contexts/AuthContext";
import { RouteGuard } from "./components/auth/RouteGuard";

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
            
            {/* Protected routes */}
            <Route path="/" element={
              <RouteGuard>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/empresas" element={
              <RouteGuard>
                <MainLayout>
                  <Empresas />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/funcionarios" element={
              <RouteGuard>
                <MainLayout>
                  <Funcionarios />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/setores" element={
              <RouteGuard>
                <MainLayout>
                  <Setores />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/funcoes" element={
              <RouteGuard>
                <MainLayout>
                  <Funcoes />
                </MainLayout>
              </RouteGuard>
            } />
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
            <Route path="/relatorios" element={
              <RouteGuard>
                <MainLayout>
                  <Relatorios />
                </MainLayout>
              </RouteGuard>
            } />
            <Route path="/configuracoes" element={
              <RouteGuard>
                <MainLayout>
                  <Configuracoes />
                </MainLayout>
              </RouteGuard>
            } />
            
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
