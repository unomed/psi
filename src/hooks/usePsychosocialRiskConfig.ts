
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface PsychosocialRiskConfig {
  id: string;
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

export function usePsychosocialRiskConfig(companyId?: string) {
  const queryClient = useQueryClient();
  const { userCompanies } = useAuth();

  const targetCompanyId = companyId || (userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : null);

  // Buscar configuração de risco psicossocial
  const { data: config, isLoading, error } = useQuery({
    queryKey: ['psychosocialRiskConfig', targetCompanyId],
    queryFn: async () => {
      if (!targetCompanyId) throw new Error('Company ID is required');

      const { data, error } = await supabase
        .from('psychosocial_risk_config')
        .select('*')
        .eq('company_id', targetCompanyId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Error fetching psychosocial risk config:', error);
        throw error;
      }

      // Se não encontrar configuração, retornar configuração padrão
      if (!data) {
        return {
          id: '',
          company_id: targetCompanyId,
          threshold_low: 25,
          threshold_medium: 50,
          threshold_high: 75,
          periodicidade_dias: 180,
          prazo_acao_critica_dias: 7,
          prazo_acao_alta_dias: 30,
          auto_generate_plans: true,
          notification_enabled: true,
        } as PsychosocialRiskConfig;
      }

      return data as PsychosocialRiskConfig;
    },
    enabled: !!targetCompanyId
  });

  // Atualizar configuração
  const updateConfig = useMutation({
    mutationFn: async (configData: Partial<PsychosocialRiskConfig>) => {
      if (!targetCompanyId) throw new Error('Company ID is required');

      // Validar configuração antes de salvar
      const errors = validateConfig(configData);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const dataToUpdate = {
        ...configData,
        company_id: targetCompanyId,
      };

      // Se não tem ID, é uma nova configuração
      if (!config?.id) {
        const { data, error } = await supabase
          .from('psychosocial_risk_config')
          .insert(dataToUpdate)
          .select()
          .single();

        if (error) throw error;
        return data as PsychosocialRiskConfig;
      }

      // Atualizar configuração existente
      const { data, error } = await supabase
        .from('psychosocial_risk_config')
        .update(dataToUpdate)
        .eq('id', config.id)
        .select()
        .single();

      if (error) throw error;
      return data as PsychosocialRiskConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychosocialRiskConfig'] });
      toast.success('Configuração atualizada com sucesso');
    },
    onError: (error) => {
      console.error('Error updating psychosocial risk config:', error);
      toast.error(`Erro ao atualizar configuração: ${error.message}`);
    }
  });

  // Validar configuração
  const validateConfig = (configData: Partial<PsychosocialRiskConfig>): string[] => {
    const errors: string[] = [];

    if (configData.threshold_low && configData.threshold_medium) {
      if (configData.threshold_low >= configData.threshold_medium) {
        errors.push('Threshold baixo deve ser menor que o médio');
      }
    }

    if (configData.threshold_medium && configData.threshold_high) {
      if (configData.threshold_medium >= configData.threshold_high) {
        errors.push('Threshold médio deve ser menor que o alto');
      }
    }

    if (configData.threshold_low && configData.threshold_high) {
      if (configData.threshold_low >= configData.threshold_high) {
        errors.push('Threshold baixo deve ser menor que o alto');
      }
    }

    if (configData.prazo_acao_critica_dias && configData.prazo_acao_critica_dias <= 0) {
      errors.push('Prazo para ação crítica deve ser maior que zero');
    }

    if (configData.prazo_acao_alta_dias && configData.prazo_acao_alta_dias <= 0) {
      errors.push('Prazo para ação alta deve ser maior que zero');
    }

    if (configData.periodicidade_dias && configData.periodicidade_dias <= 0) {
      errors.push('Periodicidade deve ser maior que zero');
    }

    return errors;
  };

  return {
    config,
    isLoading,
    error,
    updateConfig,
    validateConfig
  };
}
