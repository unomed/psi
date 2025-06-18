
import React, { useState, useEffect } from 'react';

// Sistema de toast nativo independente
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
    if (typeof window !== 'undefined') {
      (window as any).showNativeToast = this.showToast.bind(this);
    }
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

// Componente de toast com sistema nativo apenas
export function EnhancedToastSystem() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      // Inicializar sistema nativo
      NativeToastSystem.getInstance();
      setIsInitialized(true);
      console.log('[EnhancedToastSystem] Sistema nativo de toast inicializado');
    } catch (error) {
      console.error('[EnhancedToastSystem] Erro ao inicializar:', error);
    }
  }, []);

  // Retorna null - o sistema funciona via DOM direto
  return null;
}
