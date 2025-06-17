import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { SafeLazyToaster } from "@/components/ui/lazy-toaster";
import React from "react";
import { EnhancedToastSystem } from "@/components/ui/enhanced-toast-system";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

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
  console.log('[App] Inicializando aplicação com arquitetura robusta e sistema de toast nativo');
  
  // Enhanced error boundary for critical initialization issues
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <TooltipProvider delayDuration={300}>
              <AppContent />
              <EnhancedToastSystem />
              <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('[App] Critical initialization error:', error);
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ 
          maxWidth: '400px', 
          padding: '20px', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px',
          backgroundColor: '#ffffff'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Erro de Inicialização</h1>
          <p style={{ marginBottom: '20px', color: '#64748b' }}>
            Ocorreu um erro durante a inicialização da aplicação. Isso pode ser devido a problemas de compatibilidade do navegador.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }
}

export default App;
