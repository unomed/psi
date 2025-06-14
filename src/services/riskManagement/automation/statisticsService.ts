
import { supabase } from "@/integrations/supabase/client";

export class AutomationStatisticsService {
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
}
