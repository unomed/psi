
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { ToastErrorBoundary } from './toast-error-boundary';

// Lazy load do Toaster
const LazyToaster = lazy(() => 
  import('./toaster').then(module => ({ default: module.Toaster }))
);

// Sistema de toast nativo como fallback
class NativeToastSystem {
  private static instance: NativeToastSystem;
  private container: HTMLElement | null = null;
  private isInitialized = false;

  static getInstance(): NativeToastSystem {
    if (!NativeToastSystem.instance) {
      NativeToastSystem.instance = new NativeToastSystem();
    }
    return NativeToastSystem.instance;
  }

  private initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Criar container
    this.container = document.createElement('div');
    this.container.id = 'native-toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
      max-width: 400px;
    `;
    document.body.appendChild(this.container);

    // Adicionar estilos CSS
    if (!document.getElementById('native-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'native-toast-styles';
      style.textContent = `
        @keyframes nativeToastSlideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes nativeToastSlideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .native-toast {
          animation: nativeToastSlideIn 0.3s ease-out forwards;
        }
        .native-toast.removing {
          animation: nativeToastSlideOut 0.3s ease-in forwards;
        }
      `;
      document.head.appendChild(style);
    }

    // Configurar função global
    window.showNativeToast = this.showToast.bind(this);
    this.isInitialized = true;
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 5000) {
    if (!this.isInitialized) this.initialize();
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = 'native-toast';
    toast.style.cssText = `
      background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 8px;
      pointer-events: auto;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: system-ui, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      max-width: 100%;
      word-wrap: break-word;
    `;

    // Adicionar ícone baseado no tipo
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${message}`;
    
    this.container.appendChild(toast);

    // Remover após duração especificada
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('removing');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, duration);
  }
}

// Componente de toast com verificação de estabilidade
export function EnhancedToastSystem() {
  const [isReactStable, setIsReactStable] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const maxRetries = 3;

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkReactStability = () => {
      try {
        // Verificar se React e seus hooks estão funcionando
        const hasReactHooks = typeof React !== 'undefined' && 
                             React.useState && 
                             React.useEffect && 
                             React.useContext;
        
        const hasDocument = typeof document !== 'undefined' && 
                           document.readyState === 'complete';
        
        if (hasReactHooks && hasDocument) {
          console.log('[EnhancedToastSystem] React estável detectado');
          if (mounted) setIsReactStable(true);
          return;
        }
        
        if (retryCount >= maxRetries) {
          console.warn('[EnhancedToastSystem] Máximo de tentativas atingido, usando apenas sistema nativo');
          if (mounted) setHasGivenUp(true);
          return;
        }
        
        // Retry com delay
        const delay = 200 * Math.pow(1.5, retryCount);
        timeoutId = setTimeout(() => {
          if (mounted) {
            setRetryCount(prev => prev + 1);
          }
        }, delay);
        
      } catch (error) {
        console.error('[EnhancedToastSystem] Erro durante verificação:', error);
        if (mounted) {
          if (retryCount >= maxRetries) {
            setHasGivenUp(true);
          } else {
            setRetryCount(prev => prev + 1);
          }
        }
      }
    };

    // Inicializar sistema nativo primeiro
    NativeToastSystem.getInstance();
    
    // Verificar estabilidade
    timeoutId = setTimeout(checkReactStability, 100);
    
    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [retryCount]);

  // Se desistimos ou React não está estável, só usar sistema nativo
  if (hasGivenUp || !isReactStable) {
    return null; // Sistema nativo já está configurado
  }

  // Tentar usar o Toaster do Radix
  return (
    <ToastErrorBoundary>
      <Suspense fallback={null}>
        <LazyToaster />
      </Suspense>
    </ToastErrorBoundary>
  );
}
