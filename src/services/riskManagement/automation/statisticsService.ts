
import { supabase } from "@/integrations/supabase/client";

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

export class AutomationStatisticsService {
  // Obter estatísticas de automação
  static async getAutomationStats(companyId: string): Promise<ProcessingStats> {
    try {
      const { data, error } = await supabase.rpc('get_psychosocial_processing_stats', {
        p_company_id: companyId,
        p_start_date: null,
        p_end_date: null
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
      // Retornar estatísticas zeradas em caso de erro
      return {
        total_processed: 0,
        successful_processed: 0,
        failed_processed: 0,
        avg_processing_time_seconds: 0,
        high_risk_found: 0,
        critical_risk_found: 0,
        action_plans_generated: 0,
        notifications_sent: 0
      };
    }
  }
}
