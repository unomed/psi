
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface TagSystemErrorBoundaryProps {
  children: React.ReactNode;
}

interface TagSystemErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class TagSystemErrorBoundary extends React.Component<
  TagSystemErrorBoundaryProps,
  TagSystemErrorBoundaryState
> {
  constructor(props: TagSystemErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<TagSystemErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[TagSystemErrorBoundary] Erro capturado:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="w-full border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Erro no Sistema de Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-red-700">
                Ocorreu um erro inesperado no sistema de tags. Isso pode estar relacionado a:
              </p>
              <ul className="text-xs text-red-600 list-disc list-inside space-y-1">
                <li>Problemas de conectividade com o banco de dados</li>
                <li>Permissões insuficientes (RLS policies)</li>
                <li>Dados corrompidos ou inconsistentes</li>
                <li>Migração incompleta do sistema JSONB para relacional</li>
              </ul>
            </div>

            {this.state.error && (
              <div className="p-3 bg-red-100 rounded border border-red-200">
                <p className="text-xs font-mono text-red-800">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={this.handleRetry}
                className="bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Recarregar Página
              </Button>
            </div>

            <div className="text-xs text-gray-600">
              <strong>Dica:</strong> Use o botão "🔧 Debug" na seção de tags para mais informações sobre o problema.
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
