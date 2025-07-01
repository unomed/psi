
import { useState, useEffect } from 'react';

// Hook nativo que usa apenas window.matchMedia
export function useIsMobileNative() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    let mounted = true;

    const checkMobile = () => {
      if (!mounted || typeof window === 'undefined') return;
      setIsMobile(window.innerWidth < 768);
    };

    // Verificação inicial
    checkMobile();

    // Listener para mudanças
    const handleResize = () => {
      if (mounted) {
        checkMobile();
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}

// Versão que não usa hooks para casos extremos
export function getIsMobileStatic(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}
