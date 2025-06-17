
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeLoginForm } from './login/NativeLoginForm';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Componente de login totalmente nativo para emergência
const EmergencyLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">PSI Safe</h1>
                <p className="text-sm text-muted-foreground">Unomed - Sistema de Gestão</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Modo de Recuperação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                O sistema está com problemas técnicos. Este é o modo de login de emergência.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'} 
                className="w-full"
              >
                Recarregar Aplicação
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                Se o problema persistir, entre em contato com o suporte técnico.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export class AuthErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('[AuthErrorBoundary] Authentication system error:', error);
    return { 
      hasError: true, 
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AuthErrorBoundary] Authentication error details:', error, errorInfo);
    
    // Configurar sistema de toast nativo
    this.setupNativeToastSystem();
    
    this.setState({
      error,
      errorInfo
    });
  }

  private setupNativeToastSystem() {
    // Criar sistema de toast nativo que não depende de React
    if (typeof window !== 'undefined' && !window.showNativeToast) {
      window.showNativeToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        // Criar container se não existir
        let container = document.getElementById('native-toast-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'native-toast-container';
          container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
            max-width: 400px;
          `;
          document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.style.cssText = `
          background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 8px;
          pointer-events: auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideInRight 0.3s ease-out forwards;
          transform: translateX(100%);
          opacity: 0;
        `;
        
        // Adicionar animação CSS se não existir
        if (!document.getElementById('native-toast-styles')) {
          const style = document.createElement('style');
          style.id = 'native-toast-styles';
          style.textContent = `
            @keyframes slideInRight {
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            @keyframes slideOutRight {
              to {
                transform: translateX(100%);
                opacity: 0;
              }
            }
          `;
          document.head.appendChild(style);
        }
        
        toast.textContent = message;
        container.appendChild(toast);
        
        // Remover após 5 segundos
        setTimeout(() => {
          if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
              if (toast.parentNode) {
                toast.remove();
              }
            }, 300);
          }
        }, 5000);
      };
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Se há um componente fallback específico, use-o
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      // Senão, usar o login de emergência
      return <EmergencyLogin />;
    }

    return this.props.children;
  }
}

// Declaração global para TypeScript
declare global {
  interface Window {
    showNativeToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  }
}
