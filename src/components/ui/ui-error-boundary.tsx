
import React from 'react';

interface UIErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface UIErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class UIErrorBoundary extends React.Component<UIErrorBoundaryProps, UIErrorBoundaryState> {
  constructor(props: UIErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): UIErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('UI Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-sm text-muted-foreground">
          Componente indisponível temporariamente
        </div>
      );
    }

    return this.props.children;
  }
}
