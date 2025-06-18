
import { useState, useEffect } from 'react';
import { ReactStabilityChecker } from '@/utils/ReactStabilityChecker';

export function useReactStability() {
  const [isStable, setIsStable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkStability = async () => {
      if (!mounted) return;

      try {
        setIsChecking(true);
        const checker = ReactStabilityChecker.getInstance();
        const stable = await checker.checkReactStability();
        
        if (mounted) {
          if (stable) {
            setIsStable(true);
            setIsChecking(false);
          } else if (retryCount < maxRetries) {
            // Retry com delay exponencial
            const delay = 200 * Math.pow(1.5, retryCount);
            timeoutId = setTimeout(() => {
              if (mounted) {
                setRetryCount(prev => prev + 1);
              }
            }, delay);
          } else {
            // Máximo de tentativas atingido
            setIsStable(false);
            setIsChecking(false);
          }
        }
      } catch (error) {
        console.error('[useReactStability] Erro:', error);
        if (mounted) {
          setIsStable(false);
          setIsChecking(false);
        }
      }
    };

    checkStability();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [retryCount]);

  return { isStable, isChecking, retryCount };
}
