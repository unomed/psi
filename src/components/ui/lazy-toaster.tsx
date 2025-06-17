
import React, { Suspense, lazy } from 'react';
import { ToastErrorBoundary } from './toast-error-boundary';

// Lazy load the actual Toaster component
const LazyToaster = lazy(() => 
  import('./toaster').then(module => ({ default: module.Toaster }))
);

// Loading fallback component
const ToasterLoadingFallback = () => (
  <div style={{ display: 'none' }}>
    {/* Hidden loading state for toaster */}
  </div>
);

// Função melhorada para verificar se o React está pronto
const checkReactStability = (): boolean => {
  try {
    // Verificações múltiplas para garantir estabilidade
    const hasReactHooks = typeof React !== 'undefined' && 
                         React.useState && 
                         React.useEffect && 
                         React.useContext &&
                         React.useMemo &&
                         React.useCallback;
    
    const hasDocument = typeof document !== 'undefined' && 
                       document.readyState === 'complete';
    
    const hasWindow = typeof window !== 'undefined' &&
                     window.React !== undefined;
    
    // Verificar se não estamos em um loop de renderização
    const isStableRender = !document.querySelector('[data-react-error]');
    
    return hasReactHooks && hasDocument && isStableRender;
  } catch (error) {
    console.warn('[SafeLazyToaster] Erro na verificação de estabilidade:', error);
    return false;
  }
};

export function SafeLazyToaster() {
  const [isReactReady, setIsReactReady] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const [hasGivenUp, setHasGivenUp] = React.useState(false);
  const maxRetries = 5;
  const baseDelay = 300;

  React.useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkAndRetry = () => {
      if (!mounted) return;
      
      try {
        console.log(`[SafeLazyToaster] Verificação ${retryCount + 1}/${maxRetries}`);
        
        if (checkReactStability()) {
          console.log('[SafeLazyToaster] React estável detectado, habilitando toaster');
          setIsReactReady(true);
          return;
        }
        
        if (retryCount >= maxRetries) {
          console.warn('[SafeLazyToaster] Máximo de tentativas atingido, desistindo do toaster');
          setHasGivenUp(true);
          return;
        }
        
        // Retry com backoff exponencial
        const delay = baseDelay * Math.pow(1.5, retryCount);
        console.log(`[SafeLazyToaster] React não pronto, tentando novamente em ${delay}ms`);
        
        timeoutId = setTimeout(() => {
          if (mounted) {
            setRetryCount(prev => prev + 1);
          }
        }, delay);
        
      } catch (error) {
        console.error('[SafeLazyToaster] Erro durante verificação:', error);
        if (retryCount >= maxRetries) {
          setHasGivenUp(true);
        } else {
          timeoutId = setTimeout(() => {
            if (mounted) {
              setRetryCount(prev => prev + 1);
            }
          }, baseDelay * 2);
        }
      }
    };

    // Delay inicial para permitir estabilização
    timeoutId = setTimeout(checkAndRetry, 150);
    
    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [retryCount]);

  // Se desistimos, não renderizar o toaster
  if (hasGivenUp) {
    console.log('[SafeLazyToaster] Toaster desabilitado devido a instabilidade do React');
    return <ToasterLoadingFallback />;
  }

  // Se React não está pronto, mostrar fallback
  if (!isReactReady) {
    return <ToasterLoadingFallback />;
  }

  // React está pronto, tentar renderizar o toaster
  return (
    <ToastErrorBoundary>
      <Suspense fallback={<ToasterLoadingFallback />}>
        <LazyToaster />
      </Suspense>
    </ToastErrorBoundary>
  );
}
