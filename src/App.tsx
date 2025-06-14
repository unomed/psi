
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import EmployeePortal from "./pages/EmployeePortal"; // Nova página
import { AuthRoutes } from "@/components/routing/AuthRoutes";
import { MainRoutes } from "@/components/routing/MainRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <AuthProvider>
              <Routes>
                {/* Rota pública para funcionários */}
                <Route path="/funcionario" element={<EmployeePortal />} />
                
                {/* Rota inicial */}
                <Route path="/" element={<Index />} />
                
                {/* Rotas de autenticação */}
                <AuthRoutes />
                
                {/* Rotas protegidas */}
                <Route path="/*" element={
                  <RouteGuard>
                    <MainRoutes />
                  </RouteGuard>
                } />
              </Routes>
            </AuthProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
