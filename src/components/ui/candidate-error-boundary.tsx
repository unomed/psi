
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CandidateErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface CandidateErrorBoundaryProps {
  children: React.ReactNode;
}

export class CandidateErrorBoundary extends React.Component<
  CandidateErrorBoundaryProps,
  CandidateErrorBoundaryState
> {
  constructor(props: CandidateErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): CandidateErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro na página de candidatos:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <CardTitle>Página Temporariamente Indisponível</CardTitle>
              </div>
              <CardDescription>
                Ocorreu um erro ao carregar esta funcionalidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <p className="text-muted-foreground mb-4">
                  Esta funcionalidade está sendo atualizada e estará disponível em breve.
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Tentar Novamente
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
