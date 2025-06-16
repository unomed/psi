
import { useEffect, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TagChangeEvent {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  table: 'employee_tags' | 'employee_tag_types' | 'role_required_tags';
  record: any;
  timestamp: string;
}

interface RealTimeTagMonitoringOptions {
  employeeId?: string;
  companyId?: string;
  onTagChange?: (event: TagChangeEvent) => void;
  enableNotifications?: boolean;
}

export function useRealTimeTagMonitoring({
  employeeId,
  companyId,
  onTagChange,
  enableNotifications = true
}: RealTimeTagMonitoringOptions) {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [eventsCount, setEventsCount] = useState(0);

  const handleTagEvent = useCallback((
    eventType: 'INSERT' | 'UPDATE' | 'DELETE',
    table: string,
    payload: any
  ) => {
    const event: TagChangeEvent = {
      eventType,
      table: table as any,
      record: payload.new || payload.old,
      timestamp: new Date().toISOString()
    };

    console.log(`[RealTimeTagMonitoring] ${eventType} em ${table}:`, event);

    // Invalidar cache relevante
    if (table === 'employee_tags' && employeeId) {
      queryClient.invalidateQueries({ 
        queryKey: ['optimized-employee-tags', employeeId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['employee-tags', employeeId] 
      });
    }

    if (table === 'employee_tag_types') {
      queryClient.invalidateQueries({ 
        queryKey: ['optimized-tag-types'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['tag-types'] 
      });
    }

    if (table === 'role_required_tags') {
      queryClient.invalidateQueries({ 
        queryKey: ['role-required-tags'] 
      });
    }

    // Callback personalizado
    if (onTagChange) {
      onTagChange(event);
    }

    // Notificações
    if (enableNotifications && table === 'employee_tags') {
      if (eventType === 'INSERT') {
        toast.success(`Nova tag adicionada: ${event.record.tag_type?.name || 'Tag'}`);
      } else if (eventType === 'DELETE') {
        toast.info(`Tag removida do sistema`);
      }
    }

    setEventsCount(prev => prev + 1);
  }, [queryClient, employeeId, onTagChange, enableNotifications]);

  useEffect(() => {
    console.log("[RealTimeTagMonitoring] Configurando monitoramento em tempo real...");
    setConnectionStatus('connecting');

    // Canal para employee_tags
    const employeeTagsChannel = supabase
      .channel('employee-tags-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'employee_tags',
        filter: employeeId ? `employee_id=eq.${employeeId}` : undefined
      }, (payload) => {
        handleTagEvent(payload.eventType as any, 'employee_tags', payload);
      });

    // Canal para employee_tag_types
    const tagTypesChannel = supabase
      .channel('tag-types-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'employee_tag_types'
      }, (payload) => {
        handleTagEvent(payload.eventType as any, 'employee_tag_types', payload);
      });

    // Canal para role_required_tags
    const roleTagsChannel = supabase
      .channel('role-tags-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'role_required_tags'
      }, (payload) => {
        handleTagEvent(payload.eventType as any, 'role_required_tags', payload);
      });

    // Subscrever aos canais
    const subscribeChannels = async () => {
      try {
        await Promise.all([
          employeeTagsChannel.subscribe(),
          tagTypesChannel.subscribe(),
          roleTagsChannel.subscribe()
        ]);
        
        setConnectionStatus('connected');
        console.log("[RealTimeTagMonitoring] Canais conectados com sucesso");
        
        if (enableNotifications) {
          toast.success("📡 Monitoramento em tempo real ativado");
        }
      } catch (error) {
        console.error("[RealTimeTagMonitoring] Erro ao conectar canais:", error);
        setConnectionStatus('disconnected');
        
        if (enableNotifications) {
          toast.error("Erro ao ativar monitoramento em tempo real");
        }
      }
    };

    subscribeChannels();

    // Cleanup
    return () => {
      console.log("[RealTimeTagMonitoring] Desconectando canais...");
      
      supabase.removeChannel(employeeTagsChannel);
      supabase.removeChannel(tagTypesChannel);
      supabase.removeChannel(roleTagsChannel);
      
      setConnectionStatus('disconnected');
    };
  }, [employeeId, handleTagEvent, enableNotifications]);

  // Métricas do monitoramento
  const monitoringMetrics = {
    connectionStatus,
    eventsReceived: eventsCount,
    isMonitoring: connectionStatus === 'connected',
    uptime: connectionStatus === 'connected' ? 'Active' : 'Inactive'
  };

  return {
    connectionStatus,
    eventsCount,
    monitoringMetrics,
    isConnected: connectionStatus === 'connected'
  };
}
