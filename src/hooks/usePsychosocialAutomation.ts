
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface PsychosocialAutomationConfig {
  id?: string;
  company_id: string;
  auto_process_enabled: boolean;
  auto_generate_action_plans: boolean;
  notification_enabled: boolean;
  notification_recipients: string[];
  processing_delay_minutes: number;
  high_risk_immediate_notification: boolean;
  critical_risk_escalation: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessingLog {
  id: string;
  assessment_response_id: string;
  company_id: string;
  processing_stage: string;
  status: 'processing' | 'completed' | 'error';
  details: Record<string, any>;
  error_message?: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export interface PsychosocialNotification {
  id: string;
  company_id: string;
  risk_analysis_id?: string;
  notification_type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  recipients: string[];
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed';
  metadata: Record<string, any>;
  created_at: string;
}

export interface ProcessingStats {
  total_processed: number;
  successful_processed: number;
  failed_processed: number;
  avg_processing_time_seconds: number;
  high_risk_found: number;
  critical_risk_found: number;
  action_plans_generated: number;
  notifications_sent: number;
}

export function usePsychosocialAutomation(companyId?: string) {
  const queryClient = useQueryClient();
  const { userCompanies } = useAuth();

  const targetCompanyId = companyId || (userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : null);

  // Buscar configuração de automação
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['psychosocialAutomationConfig', targetCompanyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('psychosocial_automation_config')
        .select('*')
        .eq('company_id', targetCompanyId!)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as PsychosocialAutomationConfig | null;
    },
    enabled: !!targetCompanyId
  });

  // Buscar logs de processamento
  const { data: processingLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['psychosocialProcessingLogs', targetCompanyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('psychosocial_processing_logs')
        .select('*')
        .eq('company_id', targetCompanyId!)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []) as ProcessingLog[];
    },
    enabled: !!targetCompanyId
  });

  // Buscar notificações
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['psychosocialNotifications', targetCompanyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('psychosocial_notifications')
        .select('*')
        .eq('company_id', targetCompanyId!)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data || []) as PsychosocialNotification[];
    },
    enabled: !!targetCompanyId
  });

  // Buscar estatísticas de processamento
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['psychosocialProcessingStats', targetCompanyId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_psychosocial_processing_stats', {
        p_company_id: targetCompanyId,
        p_start_date: null,
        p_end_date: null
      });

      if (error) throw error;
      return data[0] as ProcessingStats;
    },
    enabled: !!targetCompanyId
  });

  // Atualizar configuração de automação
  const updateConfig = useMutation({
    mutationFn: async (newConfig: Partial<PsychosocialAutomationConfig>) => {
      const { data, error } = await supabase
        .from('psychosocial_automation_config')
        .upsert({
          company_id: targetCompanyId!,
          ...newConfig
        }, { onConflict: 'company_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychosocialAutomationConfig'] });
      toast.success('Configurações de automação atualizadas com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar configurações de automação');
    }
  });

  // Processar avaliação manualmente
  const processAssessment = useMutation({
    mutationFn: async (assessmentResponseId: string) => {
      const { data, error } = await supabase.rpc('process_psychosocial_assessment_auto', {
        p_assessment_response_id: assessmentResponseId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychosocialProcessingLogs'] });
      queryClient.invalidateQueries({ queryKey: ['psychosocialNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['psychosocialProcessingStats'] });
      toast.success('Processamento iniciado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao iniciar processamento');
    }
  });

  // Marcar notificação como enviada
  const markNotificationSent = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('psychosocial_notifications')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychosocialNotifications'] });
      toast.success('Notificação marcada como enviada');
    },
    onError: () => {
      toast.error('Erro ao atualizar notificação');
    }
  });

  return {
    config,
    processingLogs: processingLogs || [],
    notifications: notifications || [],
    stats,
    isLoading: configLoading || logsLoading || notificationsLoading || statsLoading,
    updateConfig,
    processAssessment,
    markNotificationSent
  };
}
