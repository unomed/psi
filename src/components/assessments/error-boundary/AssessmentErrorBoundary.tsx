
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { RefreshCcw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AssessmentErrorFallbackProps {
  onReset: () => void;
}

function AssessmentErrorFallback({ onReset }: AssessmentErrorFallbackProps) {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center text-red-500">
          Erro na Avaliação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">
          Ocorreu um erro ao processar a avaliação. Por favor, tente novamente ou volte para a página inicial.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Tentar novamente
          </Button>
          <Button
            variant="default"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Página inicial
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AssessmentErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallbackComponent={<AssessmentErrorFallback onReset={() => window.location.reload()} />}
    >
      {children}
    </ErrorBoundary>
  );
}
