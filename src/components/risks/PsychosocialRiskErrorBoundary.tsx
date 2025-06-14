
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error-boundary/ErrorFallback";

interface PsychosocialRiskErrorBoundaryProps {
  children: React.ReactNode;
}

export function PsychosocialRiskErrorBoundary({ children }: PsychosocialRiskErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: { componentStack: string }) => {
    console.error('Psychosocial Risk Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    
    // Em produção, você pode enviar o erro para um serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: sendErrorToMonitoring(error, errorInfo);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback
          {...props}
          title="Erro no Módulo de Risco Psicossocial"
          description="Ocorreu um erro no módulo de análise de risco psicossocial. Tente recarregar a página."
          showHomeButton={false}
        />
      )}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}
