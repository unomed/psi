
import { supabase } from "@/integrations/supabase/client";

export interface PsychosocialRiskConfig {
  id?: string;
  company_id: string;
  threshold_low: number;
  threshold_medium: number;
  threshold_high: number;
  periodicidade_dias: number;
  prazo_acao_critica_dias: number;
  prazo_acao_alta_dias: number;
  auto_generate_plans: boolean;
  notification_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_CONFIG: Omit<PsychosocialRiskConfig, 'company_id'> = {
  threshold_low: 25,
  threshold_medium: 50,
  threshold_high: 75,
  periodicidade_dias: 180,
  prazo_acao_critica_dias: 7,
  prazo_acao_alta_dias: 30,
  auto_generate_plans: true,
  notification_enabled: true,
};

export class PsychosocialRiskConfigService {
  static async getConfig(companyId: string): Promise<PsychosocialRiskConfig> {
    try {
      const { data, error } = await supabase
        .from('psychosocial_risk_config')
        .select('*')
        .eq('company_id', companyId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      if (!data) {
        // Return default config if none exists
        return { ...DEFAULT_CONFIG, company_id: companyId };
      }

      return data;
    } catch (error) {
      console.error('Error fetching psychosocial risk config:', error);
      return { ...DEFAULT_CONFIG, company_id: companyId };
    }
  }

  static async updateConfig(config: PsychosocialRiskConfig): Promise<PsychosocialRiskConfig> {
    try {
      const { data, error } = await supabase
        .from('psychosocial_risk_config')
        .upsert(config, { onConflict: 'company_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating psychosocial risk config:', error);
      throw error;
    }
  }

  static validateConfig(config: Partial<PsychosocialRiskConfig>): string[] {
    const errors: string[] = [];

    if (config.threshold_low && (config.threshold_low < 0 || config.threshold_low > 100)) {
      errors.push('Threshold baixo deve estar entre 0 e 100');
    }

    if (config.threshold_medium && (config.threshold_medium < 0 || config.threshold_medium > 100)) {
      errors.push('Threshold médio deve estar entre 0 e 100');
    }

    if (config.threshold_high && (config.threshold_high < 0 || config.threshold_high > 100)) {
      errors.push('Threshold alto deve estar entre 0 e 100');
    }

    if (config.threshold_low && config.threshold_medium && config.threshold_low >= config.threshold_medium) {
      errors.push('Threshold baixo deve ser menor que o médio');
    }

    if (config.threshold_medium && config.threshold_high && config.threshold_medium >= config.threshold_high) {
      errors.push('Threshold médio deve ser menor que o alto');
    }

    if (config.periodicidade_dias && config.periodicidade_dias < 30) {
      errors.push('Periodicidade deve ser de pelo menos 30 dias');
    }

    if (config.prazo_acao_critica_dias && config.prazo_acao_critica_dias < 1) {
      errors.push('Prazo para ação crítica deve ser de pelo menos 1 dia');
    }

    if (config.prazo_acao_alta_dias && config.prazo_acao_alta_dias < 1) {
      errors.push('Prazo para ação alta deve ser de pelo menos 1 dia');
    }

    return errors;
  }
}
