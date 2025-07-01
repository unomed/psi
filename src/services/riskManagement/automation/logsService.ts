
import { supabase } from "@/integrations/supabase/client";

export class AutomationLogsService {
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
}
