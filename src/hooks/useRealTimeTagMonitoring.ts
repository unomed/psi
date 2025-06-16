
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseRealTimeTagMonitoringOptions {
  employeeId?: string;
  companyId?: string;
  enableNotifications?: boolean;
  onTagChange?: (event: any) => void;
}

export function useRealTimeTagMonitoring({
  employeeId,
  companyId,
  enableNotifications = true,
  onTagChange
}: UseRealTimeTagMonitoringOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [eventsCount, setEventsCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  const handleTagEvent = useCallback((payload: any) => {
    console.log("[useRealTimeTagMonitoring] Tag event received:", payload);
    setEventsCount(prev => prev + 1);
    onTagChange?.(payload);
  }, [onTagChange]);

  useEffect(() => {
    if (!employeeId && !companyId) return;

    setConnectionStatus('connecting');
    
    const channel = supabase
      .channel('employee-tags-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employee_tags',
          filter: employeeId ? `employee_id=eq.${employeeId}` : undefined
        },
        handleTagEvent
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employee_tag_types'
        },
        handleTagEvent
      )
      .subscribe((status) => {
        console.log("[useRealTimeTagMonitoring] Subscription status:", status);
        setIsConnected(status === 'SUBSCRIBED');
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected');
      });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };
  }, [employeeId, companyId, handleTagEvent]);

  return {
    isConnected,
    eventsCount,
    connectionStatus
  };
}
