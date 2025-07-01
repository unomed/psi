
import { supabase } from "@/integrations/supabase/client";
import { NotificationTemplate } from "../types/automationTypes";

export class AutomationNotificationsService {
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
}
