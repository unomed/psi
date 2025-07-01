
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useSystemInitialization } from "@/hooks/useSystemInitialization";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Checklists from "./pages/Checklists";
import Assessments from "./pages/Assessments";
import AssessmentResult from "./pages/AssessmentResults";
import Employees from "./pages/Funcionarios";
import Companies from "./pages/Empresas";
import Settings from "./pages/Settings";
import EmailTemplatesPage from "./pages/configuracoes/EmailTemplatesPage";
import Dashboard from "./pages/Dashboard";
import AssessmentPortal from "./pages/AssessmentPage";
import CandidatesPage from "./pages/CandidatesPage";
import ActionPlansPage from "./pages/PlanoAcao";
import AuditPage from "./pages/configuracoes/AuditoriaPage";
import "./App.css";

const queryClient = new QueryClient();

// Componente interno que usa o hook de inicialização
function AppContent() {
  const { isInitialized, isInitializing } = useSystemInitialization();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <span className="ml-2">Inicializando sistema...</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/portal/:token" element={<AssessmentPortal />} />
        <Route path="/assessment/:id/result" element={<AssessmentResult />} />
        
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <RouteGuard>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/templates" element={<Checklists />} />
                  <Route path="/assessments" element={<Assessments />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/candidates" element={<CandidatesPage />} />
                  <Route path="/action-plans" element={<ActionPlansPage />} />
                  <Route path="/audit" element={<AuditPage />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/configuracoes/emails" element={<EmailTemplatesPage />} />
                </Routes>
              </RouteGuard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
