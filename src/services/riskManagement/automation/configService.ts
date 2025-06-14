
import { supabase } from "@/integrations/supabase/client";

export class AutomationConfigService {
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
}
