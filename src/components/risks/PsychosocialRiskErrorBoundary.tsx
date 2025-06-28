
import React from "react";

interface PsychosocialRiskErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class PsychosocialRiskErrorBoundary extends React.Component<
  PsychosocialRiskErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: PsychosocialRiskErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Psychosocial Risk Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    
    // Em produção, você pode enviar o erro para um serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: sendErrorToMonitoring(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Erro no Módulo de Risco Psicossocial
            </h2>
            <p className="text-red-600 mb-4">
              Ocorreu um erro no módulo de análise de risco psicossocial. Tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
