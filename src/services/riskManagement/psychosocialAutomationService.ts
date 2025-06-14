
import { supabase } from "@/integrations/supabase/client";

export interface AutomationTriggerResult {
  success: boolean;
  log_id?: string;
  analyses_created?: number;
  message: string;
  error?: string;
}

export interface NotificationTemplate {
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class PsychosocialAutomationService {
  // Processar avaliação automaticamente
  static async triggerAutomaticProcessing(assessmentResponseId: string): Promise<AutomationTriggerResult> {
    try {
      const { data, error } = await supabase.rpc('process_psychosocial_assessment_auto', {
        p_assessment_response_id: assessmentResponseId
      });

      if (error) throw error;

      return data as AutomationTriggerResult;
    } catch (error) {
      console.error('Error triggering automatic processing:', error);
      throw error;
    }
  }

  // Obter configuração de automação
  static async getAutomationConfig(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('psychosocial_automation_config')
        .select('*')
        .eq('company_id', companyId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching automation config:', error);
      throw error;
    }
  }

  // Criar configuração padrão para empresa
  static async createDefaultConfig(companyId: string) {
    try {
      const defaultConfig = {
        company_id: companyId,
        auto_process_enabled: true,
        auto_generate_action_plans: true,
        notification_enabled: true,
        notification_recipients: [],
        processing_delay_minutes: 5,
        high_risk_immediate_notification: true,
        critical_risk_escalation: true
      };

      const { data, error } = await supabase
        .from('psychosocial_automation_config')
        .insert(defaultConfig)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating default config:', error);
      throw error;
    }
  }

  // Obter logs de processamento recentes
  static async getRecentProcessingLogs(companyId: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('psychosocial_processing_logs')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching processing logs:', error);
      throw error;
    }
  }

  // Obter notificações pendentes
  static async getPendingNotifications(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('psychosocial_notifications')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending notifications:', error);
      throw error;
    }
  }

  // Marcar notificação como enviada
  static async markNotificationSent(notificationId: string) {
    try {
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
    } catch (error) {
      console.error('Error marking notification as sent:', error);
      throw error;
    }
  }

  // Obter estatísticas de automação
  static async getAutomationStats(companyId: string, startDate?: Date, endDate?: Date) {
    try {
      const { data, error } = await supabase.rpc('get_psychosocial_processing_stats', {
        p_company_id: companyId,
        p_start_date: startDate?.toISOString().split('T')[0] || null,
        p_end_date: endDate?.toISOString().split('T')[0] || null
      });

      if (error) throw error;
      return data[0] || {
        total_processed: 0,
        successful_processed: 0,
        failed_processed: 0,
        avg_processing_time_seconds: 0,
        high_risk_found: 0,
        critical_risk_found: 0,
        action_plans_generated: 0,
        notifications_sent: 0
      };
    } catch (error) {
      console.error('Error fetching automation stats:', error);
      throw error;
    }
  }

  // Templates de notificação
  static getNotificationTemplates(): Record<string, NotificationTemplate> {
    return {
      high_risk: {
        type: 'high_risk',
        title: 'Risco Alto Identificado',
        message: 'Foi identificado um risco alto que requer atenção imediata.',
        priority: 'high'
      },
      critical_risk: {
        type: 'critical_risk',
        title: 'Risco Crítico Identificado',
        message: 'ATENÇÃO: Risco crítico identificado! Intervenção emergencial necessária.',
        priority: 'critical'
      },
      processing_error: {
        type: 'processing_error',
        title: 'Erro no Processamento Automático',
        message: 'Ocorreu um erro durante o processamento automático. Verificação manual necessária.',
        priority: 'medium'
      },
      action_plan_generated: {
        type: 'action_plan_generated',
        title: 'Plano de Ação Gerado Automaticamente',
        message: 'Um novo plano de ação foi gerado automaticamente baseado na análise de risco.',
        priority: 'medium'
      }
    };
  }

  // Simular processamento para teste
  static async simulateProcessing(companyId: string) {
    try {
      console.log('Simulando processamento automático para empresa:', companyId);
      
      // Buscar a última avaliação completada da empresa
      const { data: assessments, error } = await supabase
        .from('assessment_responses')
        .select(`
          *,
          employees!inner(company_id)
        `)
        .eq('employees.company_id', companyId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (assessments && assessments.length > 0) {
        const assessmentId = assessments[0].id;
        console.log('Processando avaliação:', assessmentId);
        
        return await this.triggerAutomaticProcessing(assessmentId);
      } else {
        return {
          success: false,
          message: 'Nenhuma avaliação completada encontrada para simulação'
        };
      }
    } catch (error) {
      console.error('Error simulating processing:', error);
      throw error;
    }
  }
}
