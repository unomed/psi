
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Layout simplificado sem sidebar
const SimplifiedLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background">
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {children}
    </div>
  </div>
);

export class SidebarErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('[SidebarErrorBoundary] Sidebar system error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[SidebarErrorBoundary] Sidebar error details:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      console.log('[SidebarErrorBoundary] Renderizando layout simplificado');
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <SimplifiedLayout>{this.props.children}</SimplifiedLayout>;
    }

    return this.props.children;
  }
}
