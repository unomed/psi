
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/empresas" element={
            <MainLayout>
              <Empresas />
            </MainLayout>
          } />
          <Route path="/funcionarios" element={
            <MainLayout>
              <Funcionarios />
            </MainLayout>
          } />
          <Route path="/setores" element={
            <MainLayout>
              <Setores />
            </MainLayout>
          } />
          <Route path="/funcoes" element={
            <MainLayout>
              <Funcoes />
            </MainLayout>
          } />
          <Route path="/checklists" element={
            <MainLayout>
              <Checklists />
            </MainLayout>
          } />
          <Route path="/avaliacoes" element={
            <MainLayout>
              <Avaliacoes />
            </MainLayout>
          } />
          <Route path="/relatorios" element={
            <MainLayout>
              <Relatorios />
            </MainLayout>
          } />
          <Route path="/configuracoes" element={
            <MainLayout>
              <Configuracoes />
            </MainLayout>
          } />
          {/* Public assessment route - accessible without login */}
          <Route path="/avaliacao/:token" element={<AssessmentPage />} />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
