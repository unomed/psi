
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useReactStability } from '@/hooks/useReactStability';
import { ToastErrorBoundary } from './toast-error-boundary';

// Lazy load do Toaster
const LazyToaster = lazy(() => 
  import('./toaster').then(module => ({ default: module.Toaster }))
);

// Sistema de toast nativo melhorado
class NativeToastSystemAdvanced {
  private static instance: NativeToastSystemAdvanced;
  private container: HTMLElement | null = null;
  private isInitialized = false;

  static getInstance(): NativeToastSystemAdvanced {
    if (!NativeToastSystemAdvanced.instance) {
      NativeToastSystemAdvanced.instance = new NativeToastSystemAdvanced();
    }
    return NativeToastSystemAdvanced.instance;
  }

  initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.container = document.createElement('div');
    this.container.id = 'native-toast-container-advanced';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
      max-width: 400px;
    `;
    document.body.appendChild(this.container);

    this.addStyles();
    this.setupGlobalFunction();
    this.isInitialized = true;
  }

  private addStyles() {
    if (document.getElementById('native-toast-advanced-styles')) return;

    const style = document.createElement('style');
    style.id = 'native-toast-advanced-styles';
    style.textContent = `
      @keyframes toastSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      .native-toast-advanced {
        animation: toastSlideIn 0.3s ease-out forwards;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .native-toast-advanced.removing {
        animation: toastSlideOut 0.3s ease-in forwards;
      }
    `;
    document.head.appendChild(style);
  }

  private setupGlobalFunction() {
    window.showAdvancedToast = this.showToast.bind(this);
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 5000) {
    if (!this.isInitialized) this.initialize();
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = 'native-toast-advanced';
    
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6'
    };

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    toast.style.cssText = `
      background: ${colors[type]};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 8px;
      pointer-events: auto;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 100%;
      word-wrap: break-word;
      display: flex;
      align-items: center;
    `;

    toast.innerHTML = `
      <span style="margin-right: 8px; font-weight: bold;">${icons[type]}</span>
      <span>${message}</span>
    `;
    
    this.container.appendChild(toast);

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

export function AdaptiveToastSystem() {
  const { isStable, isChecking } = useReactStability();
  const [nativeInitialized, setNativeInitialized] = useState(false);

  useEffect(() => {
    // Sempre inicializar o sistema nativo como backup
    const nativeSystem = NativeToastSystemAdvanced.getInstance();
    nativeSystem.initialize();
    setNativeInitialized(true);
  }, []);

  // Se ainda está verificando estabilidade, não renderizar nada
  if (isChecking) {
    return null;
  }

  // Se React não está estável, usar apenas sistema nativo
  if (!isStable) {
    console.log('[AdaptiveToastSystem] Usando apenas sistema nativo - React instável');
    return null;
  }

  // Se React está estável, tentar usar o Toaster do Radix
  return (
    <ToastErrorBoundary>
      <Suspense fallback={null}>
        <LazyToaster />
      </Suspense>
    </ToastErrorBoundary>
  );
}

// Declaração global para TypeScript
declare global {
  interface Window {
    showAdvancedToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  }
}
