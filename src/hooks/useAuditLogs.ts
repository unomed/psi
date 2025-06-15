
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AuditLogFilters {
  userId?: string;
  module?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  companyId?: string;
  search?: string;
}

export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: async () => {
      console.log('Buscando logs de auditoria com filtros:', filters);
      
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          profiles!audit_logs_user_id_fkey(full_name),
          companies(name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      // Aplicar filtros
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.module) {
        query = query.eq('module', filters.module);
      }
      
      if (filters.action) {
        query = query.eq('action_type', filters.action);
      }
      
      if (filters.companyId) {
        query = query.eq('company_id', filters.companyId);
      }
      
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar logs de auditoria:', error);
        throw error;
      }

      return data || [];
    },
    retry: 2
  });
}

export function useAuditLogStats(companyId?: string) {
  return useQuery({
    queryKey: ['audit-log-stats', companyId],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select('action_type, module, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar estatísticas de auditoria:', error);
        throw error;
      }

      // Processar dados para estatísticas
      const stats = {
        totalActions: data?.length || 0,
        actionsByType: {} as Record<string, number>,
        actionsByModule: {} as Record<string, number>,
        actionsLast7Days: 0,
        actionsToday: 0
      };

      const today = new Date();
      const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      data?.forEach(log => {
        const logDate = new Date(log.created_at);
        
        // Contar por tipo
        stats.actionsByType[log.action_type] = (stats.actionsByType[log.action_type] || 0) + 1;
        
        // Contar por módulo
        stats.actionsByModule[log.module] = (stats.actionsByModule[log.module] || 0) + 1;
        
        // Contar últimos 7 dias
        if (logDate >= last7Days) {
          stats.actionsLast7Days++;
        }
        
        // Contar hoje
        if (logDate.toDateString() === today.toDateString()) {
          stats.actionsToday++;
        }
      });

      return stats;
    },
    retry: 2
  });
}
