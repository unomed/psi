
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
  description?: string;
  showHomeButton?: boolean;
}

export function ErrorFallback({ 
  error, 
  resetErrorBoundary, 
  title = "Algo deu errado",
  description = "Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.",
  showHomeButton = true
}: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDevelopment && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-mono text-xs">
                {error.message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={resetErrorBoundary}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
            
            {showHomeButton && (
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
