
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface AppErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function AppErrorFallback({ error, resetErrorBoundary }: AppErrorFallbackProps) {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Erro na Aplicação
          </CardTitle>
          <CardDescription className="text-red-700">
            Ocorreu um erro inesperado. Tente recarregar a página ou volte ao início.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-red-600 bg-red-100 p-3 rounded border font-mono">
              <strong>Detalhes técnicos:</strong>
              <br />
              {error.message}
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={resetErrorBoundary}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              
              <Button 
                onClick={handleReload}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar Página
              </Button>
              
              <Button 
                onClick={handleGoHome}
                variant="default"
                className="bg-red-600 hover:bg-red-700"
              >
                <Home className="h-4 w-4 mr-2" />
                Ir para Início
              </Button>
            </div>
            
            <div className="text-xs text-red-600">
              <p>Se o problema persistir:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Limpe o cache do navegador</li>
                <li>Tente em uma aba anônima</li>
                <li>Contate o suporte técnico</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  const handleError = (error: Error, errorInfo: { componentStack: string }) => {
    console.error('[AppErrorBoundary] Erro capturado:', error);
    console.error('[AppErrorBoundary] Component Stack:', errorInfo.componentStack);
    
    // Em produção, enviar erro para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: sendErrorToMonitoring(error, errorInfo);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={AppErrorFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}
