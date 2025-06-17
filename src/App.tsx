
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

function App() {
  console.log('[App] Inicializando aplicação com arquitetura isolada');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider delayDuration={300}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              {/* Contexto administrativo isolado */}
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
