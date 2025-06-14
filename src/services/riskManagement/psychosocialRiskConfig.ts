
import { supabase } from "@/integrations/supabase/client";
import { PsychosocialRiskConfig } from "@/hooks/usePsychosocialRiskConfig";

export class PsychosocialRiskConfigService {
  static async getConfig(companyId: string): Promise<PsychosocialRiskConfig | null> {
    const { data, error } = await supabase
      .from('psychosocial_risk_config')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }

  static async updateConfig(config: Partial<PsychosocialRiskConfig>): Promise<PsychosocialRiskConfig> {
    if (!config.id) {
      // Criar nova configuração
      const { data, error } = await supabase
        .from('psychosocial_risk_config')
        .insert(config)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Atualizar configuração existente
    const { data, error } = await supabase
      .from('psychosocial_risk_config')
      .update(config)
      .eq('id', config.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createDefaultConfig(companyId: string): Promise<PsychosocialRiskConfig> {
    const defaultConfig = {
      company_id: companyId,
      threshold_low: 25,
      threshold_medium: 50,
      threshold_high: 75,
      periodicidade_dias: 180,
      prazo_acao_critica_dias: 7,
      prazo_acao_alta_dias: 30,
      auto_generate_plans: true,
      notification_enabled: true,
    };

    const { data, error } = await supabase
      .from('psychosocial_risk_config')
      .insert(defaultConfig)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
