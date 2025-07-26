/**
 * UTILITÁRIO: Critérios de Risco Unificados
 * RESPONSABILIDADE: Fonte ÚNICA de verdade para cálculo de níveis de risco
 * 
 * INTEGRAÇÃO:
 * - Consome assessment_criteria_settings (fonte única)
 * - Usado por TODOS os componentes que calculam risco
 * - Substitui valores hardcoded espalhados pelo sistema
 * 
 * USAGE:
 * - useAssessmentResultsData: para calcular risk_level
 * - Assessment forms: para classificar respostas  
 * - Reports: para estatísticas consistentes
 * - Automation: para triggers baseados em risco
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Interface para critérios unificados de risco
 * BASEADO NA TABELA: assessment_criteria_settings
 */
export interface UnifiedRiskCriteria {
  low_risk_threshold: number;      // Default: 30%
  medium_risk_threshold: number;   // Default: 60%
  // high_risk_threshold é calculado: > medium_risk_threshold até 80%
  // critical_risk_threshold é calculado: > 80%
}

/**
 * FUNÇÃO PRINCIPAL: Buscar critérios da fonte única
 * IMPORTANTE: Sempre usar esta função para obter thresholds
 */
export async function getUnifiedRiskCriteria(): Promise<UnifiedRiskCriteria> {
  try {
    const { data: settings, error } = await supabase
      .from('assessment_criteria_settings')
      .select('low_risk_threshold, medium_risk_threshold')
      .single();

    if (error) {
      console.warn('Erro ao buscar critérios unificados, usando padrões:', error);
      // Fallback para valores padrão se não encontrar configuração
      return {
        low_risk_threshold: 30,
        medium_risk_threshold: 60
      };
    }

    return {
      low_risk_threshold: settings?.low_risk_threshold || 30,
      medium_risk_threshold: settings?.medium_risk_threshold || 60
    };
  } catch (error) {
    console.error('Erro crítico ao buscar critérios:', error);
    // Fallback de segurança
    return {
      low_risk_threshold: 30,
      medium_risk_threshold: 60
    };
  }
}

/**
 * FUNÇÃO: Calcular nível de risco baseado no score
 * UNIFICADA: Mesma lógica em TODO o sistema
 */
export function calculateRiskLevel(
  score: number, 
  criteria?: UnifiedRiskCriteria
): 'Crítico' | 'Alto' | 'Médio' | 'Baixo' {
  // Usar critérios padrão se não fornecidos
  const thresholds = criteria || {
    low_risk_threshold: 30,
    medium_risk_threshold: 60
  };

  if (score > 80) return 'Crítico';                           // > 80% sempre crítico
  if (score > thresholds.medium_risk_threshold) return 'Alto'; // > medium_risk_threshold
  if (score > thresholds.low_risk_threshold) return 'Médio';   // > low_risk_threshold  
  return 'Baixo';                                             // <= low_risk_threshold
}

/**
 * FUNÇÃO: Obter cor do nível de risco
 * CONSISTENTE: Mesmas cores em todo o sistema
 */
export function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case 'crítico':
    case 'critico':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'alto':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'médio':
    case 'medio':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'baixo':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * HOOK REACT: Para usar critérios unificados em componentes
 * CACHEADO: Evita múltiplas requisições desnecessárias
 */
export function useUnifiedRiskCriteria() {
  // TODO: Implementar com react-query para cache
  // Por enquanto, função direta
  return { getUnifiedRiskCriteria, calculateRiskLevel, getRiskLevelColor };
}