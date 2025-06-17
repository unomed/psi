
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { AppRoutes } from "@/components/routing/AppRoutes";
import React from "react";

const queryClient = new QueryClient();

function AppContent() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

function App() {
  console.log('[App] Inicializando aplicação com arquitetura isolada');
  
  // Enhanced error boundary for critical initialization issues
  try {
    return (
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <BrowserRouter>
              <TooltipProvider delayDuration={300}>
                <AppContent />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </BrowserRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('[App] Critical initialization error:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Erro de Inicialização</h1>
        <p>Ocorreu um erro durante a inicialização da aplicação. Tente recarregar a página.</p>
        <button onClick={() => window.location.reload()}>Recarregar</button>
      </div>
    );
  }
}

export default App;
