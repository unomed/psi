
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePsychosocialAutomation } from "./usePsychosocialAutomation";

export interface RealTimeMetrics {
  isOnline: boolean;
  queueLength: number;
  activeJobs: number;
  lastProcessedAt: Date | null;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  avgResponseTime: number;
}

export function useRealTimeAutomation(companyId?: string) {
  const { stats, processingLogs, isLoading } = usePsychosocialAutomation(companyId);
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    isOnline: true,
    queueLength: 0,
    activeJobs: 0,
    lastProcessedAt: null,
    systemHealth: 'excellent',
    avgResponseTime: 0
  });

  useEffect(() => {
    // Simular métricas em tempo real
    const interval = setInterval(() => {
      const successRate = stats 
        ? Math.round((stats.successful_processed / Math.max(stats.total_processed, 1)) * 100)
        : 100;
      
      let systemHealth: RealTimeMetrics['systemHealth'] = 'excellent';
      if (successRate < 90) systemHealth = 'critical';
      else if (successRate < 95) systemHealth = 'warning';
      else if (successRate < 98) systemHealth = 'good';

      setMetrics({
        isOnline: true,
        queueLength: Math.floor(Math.random() * 3), // Simular fila
        activeJobs: Math.floor(Math.random() * 2), // Simular jobs ativos
        lastProcessedAt: new Date(),
        systemHealth,
        avgResponseTime: stats?.avg_processing_time_seconds || 0
      });
    }, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval);
  }, [stats]);

  // Configurar realtime listener para logs
  useEffect(() => {
    if (!companyId) return;

    const channel = supabase
      .channel('automation-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'psychosocial_processing_logs',
          filter: `company_id=eq.${companyId}`
        },
        (payload) => {
          console.log('New processing log:', payload);
          // Atualizar métricas quando novo log chegar
          setMetrics(prev => ({
            ...prev,
            lastProcessedAt: new Date()
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId]);

  return {
    metrics,
    stats,
    processingLogs,
    isLoading
  };
}
