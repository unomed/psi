
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useSystemInitialization } from "@/hooks/useSystemInitialization";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { AppErrorBoundary } from "@/components/error-boundary/AppErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Checklists from "./pages/Checklists";
import AssessmentResult from "./pages/AssessmentResults";
import Employees from "./pages/Funcionarios";
import Companies from "./pages/Empresas";
import EmailTemplatesPage from "./pages/configuracoes/EmailTemplatesPage";
import Dashboard from "./pages/Dashboard";
import AssessmentPortal from "./pages/AssessmentPage";
import ActionPlansPage from "./pages/PlanoAcao";
import AuditPage from "./pages/configuracoes/AuditoriaPage";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Componente interno que usa o hook de inicialização
function AppContent() {
  const { isInitialized, isInitializing, initializationError, hasError } = useSystemInitialization();

  console.log('[App] Estado da inicialização:', {
    isInitialized,
    isInitializing,
    hasError,
    initializationError
  });

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <div className="space-y-2">
            <span className="text-lg font-medium">Inicializando sistema...</span>
            <p className="text-sm text-muted-foreground">
              Configurando templates e verificando conectividade
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-yellow-800">
              Sistema Parcialmente Inicializado
            </h2>
            <p className="text-sm text-yellow-700">
              Alguns recursos podem não funcionar corretamente.
            </p>
            {initializationError && (
              <p className="text-xs text-yellow-600 bg-yellow-100 p-2 rounded">
                {initializationError}
              </p>
            )}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/portal/:token" element={<AssessmentPortal />} />
          <Route path="/assessment/:id/result" element={<AssessmentResult />} />
          
          <Route
            path="/*"
            element={
              <RouteGuard>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/templates" element={<Checklists />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/action-plans" element={<ActionPlansPage />} />
                  <Route path="/audit" element={<AuditPage />} />
                  <Route path="/configuracoes/emails" element={<EmailTemplatesPage />} />
                </Routes>
              </RouteGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

function App() {
  console.log('[Main] Portal do Funcionário iniciando...');
  
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <AppContent />
            <Toaster />
            <Sonner />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
