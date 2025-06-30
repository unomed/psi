
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { AppRoutes } from "@/components/routing/AppRoutes";
import MainLayout from "@/components/layout/MainLayout";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { Routes, Route } from "react-router-dom";

// Error boundary simplificado
class SimpleAppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[SimpleAppContent] Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Erro na aplicação
            </h1>
            <p className="text-gray-600 mb-4">
              Ocorreu um erro inesperado. Recarregue a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const { user, isLoading, isAuthenticated } = useSimpleAuth();

  console.log('[SimpleAppContent] Estado atual:', {
    hasUser: !!user,
    isLoading,
    isAuthenticated,
    currentPath: window.location.pathname
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostrar páginas de auth
  if (!isAuthenticated || !user) {
    console.log('[SimpleAppContent] Usuário não autenticado, mostrando tela de login');
    return (
      <Routes>
        <Route path="/auth/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Se está autenticado, mostrar aplicação principal
  console.log('[SimpleAppContent] Usuário autenticado, carregando aplicação principal');
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export function SimpleAppContent() {
  console.log('[SimpleAppContent] Inicializando roteamento principal');
  
  return (
    <SimpleAppErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </SimpleAppErrorBoundary>
  );
}
