
import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  componentRenderTime: number;
  navigationTime: number;
  cacheHitRate: number;
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    componentRenderTime: 0,
    navigationTime: 0,
    cacheHitRate: 0
  });
  
  const renderStartTime = useRef<number>(0);
  const navigationStartTime = useRef<number>(0);
  const cacheHits = useRef(0);
  const totalRequests = useRef(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({
        ...prev,
        componentRenderTime: renderTime
      }));
    };
  }, []);

  const trackNavigation = () => {
    navigationStartTime.current = performance.now();
  };

  const endNavigation = () => {
    const navigationTime = performance.now() - navigationStartTime.current;
    setMetrics(prev => ({
      ...prev,
      navigationTime
    }));
  };

  const trackCacheHit = (isHit: boolean) => {
    totalRequests.current++;
    if (isHit) cacheHits.current++;
    
    const hitRate = (cacheHits.current / totalRequests.current) * 100;
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: hitRate
    }));
  };

  const getPageLoadTime = () => {
    if (performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const loadTime = navigationEntries[0].loadEventEnd - navigationEntries[0].navigationStart;
        setMetrics(prev => ({
          ...prev,
          pageLoadTime: loadTime
        }));
      }
    }
  };

  useEffect(() => {
    // Medir tempo de carregamento da página
    if (document.readyState === 'complete') {
      getPageLoadTime();
    } else {
      window.addEventListener('load', getPageLoadTime);
      return () => window.removeEventListener('load', getPageLoadTime);
    }
  }, []);

  const logMetrics = () => {
    console.log('[Performance Metrics]', {
      'Page Load Time': `${metrics.pageLoadTime.toFixed(2)}ms`,
      'Component Render Time': `${metrics.componentRenderTime.toFixed(2)}ms`,
      'Navigation Time': `${metrics.navigationTime.toFixed(2)}ms`,
      'Cache Hit Rate': `${metrics.cacheHitRate.toFixed(1)}%`
    });
  };

  return {
    metrics,
    trackNavigation,
    endNavigation,
    trackCacheHit,
    logMetrics
  };
}
