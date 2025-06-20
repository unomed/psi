
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import { AppRoutes } from "@/components/routing/AppRoutes";

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

export function SimpleAppContent() {
  console.log('[SimpleAppContent] Configurando contextos e roteamento simplificados');
  
  return (
    <SimpleAppErrorBoundary>
      <BrowserRouter>
        <SimpleAuthProvider>
          <AppRoutes />
        </SimpleAuthProvider>
      </BrowserRouter>
    </SimpleAppErrorBoundary>
  );
}
