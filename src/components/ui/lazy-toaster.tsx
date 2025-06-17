
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

export function SafeLazyToaster() {
  // Enhanced React readiness check
  const [isReactReady, setIsReactReady] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  React.useEffect(() => {
    const checkReactReadiness = () => {
      try {
        // Multiple checks to ensure React is fully ready
        const isReactAvailable = typeof React !== 'undefined' && 
                                 React.useState && 
                                 React.useEffect && 
                                 React.useContext;
        
        const isContextReady = typeof document !== 'undefined' && 
                              document.readyState === 'complete';

        if (isReactAvailable && isContextReady) {
          console.log('[SafeLazyToaster] React is ready, enabling toaster');
          setIsReactReady(true);
        } else if (retryCount < maxRetries) {
          console.log('[SafeLazyToaster] React not ready, retrying...', { retryCount });
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 200 * (retryCount + 1)); // Exponential backoff
        } else {
          console.warn('[SafeLazyToaster] Max retries reached, skipping toaster initialization');
        }
      } catch (error) {
        console.error('[SafeLazyToaster] Error checking React readiness:', error);
        if (retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 500);
        }
      }
    };

    // Initial check
    const timer = setTimeout(checkReactReadiness, 100);
    
    return () => clearTimeout(timer);
  }, [retryCount]);

  if (!isReactReady) {
    return <ToasterLoadingFallback />;
  }

  return (
    <ToastErrorBoundary>
      <Suspense fallback={<ToasterLoadingFallback />}>
        <LazyToaster />
      </Suspense>
    </ToastErrorBoundary>
  );
}
