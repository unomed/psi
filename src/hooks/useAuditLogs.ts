
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
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Aplicar filtros
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.module) {
        query = query.eq('module', filters.module as any);
      }
      
      if (filters.action) {
        query = query.eq('action_type', filters.action as any);
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

      const { data: logsData, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar logs de auditoria:', error);
        throw error;
      }

      if (!logsData || logsData.length === 0) {
        return [];
      }

      // Buscar nomes dos usuários separadamente
      const userIds = [...new Set(logsData.map(log => log.user_id).filter(Boolean))];
      const companyIds = [...new Set(logsData.map(log => log.company_id).filter(Boolean))];
      
      let profilesMap = new Map();
      let companiesMap = new Map();

      // Buscar profiles se existem user_ids
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);
        
        profilesMap = new Map(profilesData?.map(p => [p.id, p.full_name]) || []);
      }

      // Buscar companies se existem company_ids
      if (companyIds.length > 0) {
        const { data: companiesData } = await supabase
          .from('companies')
          .select('id, name')
          .in('id', companyIds);
        
        companiesMap = new Map(companiesData?.map(c => [c.id, c.name]) || []);
      }

      // Mapear os dados de volta
      return logsData.map(log => ({
        ...log,
        profiles: { full_name: profilesMap.get(log.user_id) || 'Sistema' },
        companies: log.company_id ? { name: companiesMap.get(log.company_id) || 'N/A' } : null
      }));
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
