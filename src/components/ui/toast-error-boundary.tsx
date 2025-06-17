
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Simple toast fallback that doesn't use hooks
const SimpleToastFallback = () => {
  return (
    <div 
      id="simple-toast-container" 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    />
  );
};

export class ToastErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('[ToastErrorBoundary] Toast system error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ToastErrorBoundary] Toast error details:', error, errorInfo);
    
    // Setup simple fallback toast system
    this.setupFallbackToastSystem();
  }

  private setupFallbackToastSystem() {
    // Create a simple toast function that works without React hooks
    if (typeof window !== 'undefined') {
      (window as any).showSimpleToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const container = document.getElementById('simple-toast-container');
        if (container) {
          const toast = document.createElement('div');
          toast.style.cssText = `
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 8px;
            pointer-events: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
          `;
          toast.textContent = message;
          container.appendChild(toast);
          
          setTimeout(() => {
            if (toast.parentNode) {
              toast.remove();
            }
          }, 5000);
        }
      };
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <SimpleToastFallback />;
    }

    return this.props.children;
  }
}
