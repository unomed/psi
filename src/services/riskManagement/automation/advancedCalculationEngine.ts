import { supabase } from "@/integrations/supabase/client";

export interface CategoryWeight {
  category: string;
  weight: number;
  critical_threshold: number;
  high_threshold: number;
  medium_threshold: number;
}

export interface SectorRiskProfile {
  sector_id: string;
  risk_multipliers: Record<string, number>;
  baseline_scores: Record<string, number>;
}

export interface CalculationResult {
  category: string;
  raw_score: number;
  weighted_score: number;
  sector_adjusted_score: number;
  risk_level: 'baixo' | 'medio' | 'alto' | 'critico';
  confidence_level: number;
  contributing_factors: string[];
  recommended_actions: string[];
}

export class AdvancedCalculationEngine {
  // Calcular risco psicossocial com algoritmo avançado
  static async calculatePsychosocialRisk(
    assessmentResponseId: string,
    companyId: string,
    sectorId?: string,
    roleId?: string
  ): Promise<CalculationResult[]> {
    try {
      // Buscar dados da avaliação
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessment_responses')
        .select(`
          *,
          employees!inner(
            sector_id,
            role_id,
            sectors(name),
            roles(name)
          )
        `)
        .eq('id', assessmentResponseId)
        .single();

      if (assessmentError) throw assessmentError;

      // Corrigir acesso aos dados do funcionário
      const employee = Array.isArray(assessmentData.employees) 
        ? assessmentData.employees[0] 
        : assessmentData.employees;

      // Buscar configurações de peso por categoria (usar tabelas existentes como fallback)
      const { data: categoryWeights } = await supabase
        .from('psychosocial_criteria')
        .select('*')
        .eq('company_id', companyId);

      // Buscar perfil de risco do setor (opcional)
      const { data: sectorProfileData } = await supabase
        .from('sector_risk_profiles')
        .select('*')
        .eq('company_id', companyId)
        .eq('sector_id', employee?.sector_id)
        .single();

      // Converter perfil do setor para tipo esperado
      let sectorProfile: SectorRiskProfile | undefined;
      if (sectorProfileData) {
        sectorProfile = {
          sector_id: sectorProfileData.sector_id,
          risk_multipliers: (sectorProfileData.risk_multipliers as any) || {},
          baseline_scores: (sectorProfileData.baseline_scores as any) || {}
        };
      }

      const responses = assessmentData.response_data as Record<string, any>;
      const results: CalculationResult[] = [];

      // Categorias principais do Manual MTE (usando valores válidos)
      const categories = [
        'organizacao_trabalho',
        'condicoes_ambientais', 
        'relacoes_socioprofissionais',
        'reconhecimento_crescimento',
        'elo_trabalho_vida_social'
      ];

      for (const category of categories) {
        // Encontrar configuração correspondente
        const categoryConfig = categoryWeights?.find(cw => 
          cw.category.toString() === category || 
          cw.factor_name.toLowerCase().includes(category.split('_')[0])
        );
        
        const result = await this.calculateCategoryRisk(
          category,
          responses,
          categoryConfig ? {
            category: category,
            weight: Number(categoryConfig.weight || 1.0),
            critical_threshold: categoryConfig.threshold_high || 80,
            high_threshold: categoryConfig.threshold_medium || 60,
            medium_threshold: categoryConfig.threshold_low || 40
          } : undefined,
          sectorProfile,
          employee?.sector_id,
          employee?.role_id
        );
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Error in advanced calculation:', error);
      throw error;
    }
  }

  // Calcular risco por categoria específica
  private static async calculateCategoryRisk(
    category: string,
    responses: Record<string, any>,
    categoryWeight?: CategoryWeight,
    sectorProfile?: SectorRiskProfile,
    sectorId?: string,
    roleId?: string
  ): Promise<CalculationResult> {
    
    // Extrair respostas da categoria
    const categoryResponses = this.extractCategoryResponses(responses, category);
    
    // Calcular score bruto
    const rawScore = this.calculateRawScore(categoryResponses);
    
    // Aplicar peso da categoria
    const weight = categoryWeight?.weight || 1.0;
    const weightedScore = rawScore * weight;
    
    // Ajustar por perfil do setor
    const sectorMultiplier = sectorProfile?.risk_multipliers?.[category] || 1.0;
    const sectorAdjustedScore = weightedScore * sectorMultiplier;
    
    // Determinar nível de risco
    const riskLevel = this.determineRiskLevel(sectorAdjustedScore, categoryWeight);
    
    // Calcular confiança
    const confidenceLevel = this.calculateConfidence(categoryResponses, sectorProfile);
    
    // Identificar fatores contribuintes
    const contributingFactors = this.identifyContributingFactors(categoryResponses, category);
    
    // Gerar ações recomendadas
    const recommendedActions = await this.generateRecommendedActions(
      category,
      riskLevel,
      contributingFactors,
      sectorId,
      roleId
    );

    return {
      category,
      raw_score: rawScore,
      weighted_score: weightedScore,
      sector_adjusted_score: sectorAdjustedScore,
      risk_level: riskLevel,
      confidence_level: confidenceLevel,
      contributing_factors: contributingFactors,
      recommended_actions: recommendedActions
    };
  }

  // Extrair respostas por categoria
  private static extractCategoryResponses(responses: Record<string, any>, category: string): number[] {
    const categoryQuestions = this.getCategoryQuestions(category);
    return categoryQuestions
      .map(questionId => responses[questionId])
      .filter(response => typeof response === 'number');
  }

  // Mapear questões por categoria conforme Manual MTE
  private static getCategoryQuestions(category: string): string[] {
    const questionMap: Record<string, string[]> = {
      'organizacao_trabalho': ['q1', 'q2', 'q3', 'q4', 'q5'],
      'condicoes_ambientais': ['q6', 'q7', 'q8', 'q9'],
      'relacoes_socioprofissionais': ['q10', 'q11', 'q12', 'q13'],
      'reconhecimento_crescimento': ['q14', 'q15', 'q16', 'q17'],
      'elo_trabalho_vida_social': ['q18', 'q19', 'q20', 'q21']
    };
    return questionMap[category] || [];
  }

  // Calcular score bruto com ponderação
  private static calculateRawScore(responses: number[]): number {
    if (responses.length === 0) return 0;
    
    const sum = responses.reduce((acc, response) => acc + response, 0);
    const average = sum / responses.length;
    
    // Normalizar para escala 0-100
    return Math.min(100, Math.max(0, (average / 5) * 100));
  }

  // Determinar nível de risco baseado em thresholds
  private static determineRiskLevel(score: number, categoryWeight?: CategoryWeight): 'baixo' | 'medio' | 'alto' | 'critico' {
    const criticalThreshold = categoryWeight?.critical_threshold || 80;
    const highThreshold = categoryWeight?.high_threshold || 60;
    const mediumThreshold = categoryWeight?.medium_threshold || 40;

    if (score >= criticalThreshold) return 'critico';
    if (score >= highThreshold) return 'alto';
    if (score >= mediumThreshold) return 'medio';
    return 'baixo';
  }

  // Calcular nível de confiança
  private static calculateConfidence(responses: number[], sectorProfile?: SectorRiskProfile): number {
    if (responses.length === 0) return 0;
    
    // Confiança baseada na quantidade de respostas e variabilidade
    const completeness = Math.min(1, responses.length / 25); // Assumindo 25 questões ideais
    const variance = this.calculateVariance(responses);
    const consistency = Math.max(0, 1 - (variance / 10)); // Normalizar variância
    
    return Math.round((completeness + consistency) * 50);
  }

  // Calcular variância das respostas
  private static calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
  }

  // Identificar fatores contribuintes
  private static identifyContributingFactors(responses: number[], category: string): string[] {
    const factors: string[] = [];
    const avgScore = responses.reduce((acc, val) => acc + val, 0) / responses.length;

    // Mapear fatores por categoria
    const categoryFactors: Record<string, string[]> = {
      'organizacao_trabalho': [
        'Sobrecarga de trabalho',
        'Prazos irrealistas',
        'Complexidade excessiva',
        'Interrupções frequentes'
      ],
      'condicoes_ambientais': [
        'Ambiente físico inadequado',
        'Ruído excessivo',
        'Iluminação deficiente',
        'Temperatura inadequada'
      ],
      'relacoes_socioprofissionais': [
        'Conflitos interpessoais',
        'Isolamento social',
        'Falta de suporte',
        'Comunicação deficiente'
      ],
      'reconhecimento_crescimento': [
        'Falta de reconhecimento',
        'Ausência de feedback',
        'Limitadas oportunidades de crescimento',
        'Desvalorização profissional'
      ],
      'elo_trabalho_vida_social': [
        'Desequilíbrio trabalho-vida',
        'Horários incompatíveis',
        'Pressão por disponibilidade',
        'Conflito de papéis'
      ]
    };

    // Adicionar fatores baseado no score (score alto = fator presente)
    if (avgScore >= 3.5) {
      factors.push(...(categoryFactors[category] || []));
    }

    return factors;
  }

  // Gerar ações recomendadas
  private static async generateRecommendedActions(
    category: string,
    riskLevel: string,
    contributingFactors: string[],
    sectorId?: string,
    roleId?: string
  ): Promise<string[]> {
    
    try {
      // Buscar templates de ação específicos com type assertion
      const { data: actionTemplates } = await supabase
        .from('nr01_action_templates')
        .select('*')
        .eq('category', category as any)
        .eq('exposure_level', riskLevel as any);

      if (actionTemplates && actionTemplates.length > 0) {
        return actionTemplates.map(template => template.template_name);
      }

      // Ações padrão por categoria e nível
      const defaultActions = this.getDefaultActions(category, riskLevel);
      return defaultActions;

    } catch (error) {
      console.error('Error generating recommended actions:', error);
      return this.getDefaultActions(category, riskLevel);
    }
  }

  // Ações padrão por categoria
  private static getDefaultActions(category: string, riskLevel: string): string[] {
    const actionMap: Record<string, Record<string, string[]>> = {
      'organizacao_trabalho': {
        'critico': [
          'Redistribuir carga de trabalho imediatamente',
          'Contratar pessoal adicional',
          'Reavaliar processos críticos'
        ],
        'alto': [
          'Revisar distribuição de tarefas',
          'Implementar pausas obrigatórias',
          'Treinar gestão de tempo'
        ],
        'medio': [
          'Monitorar carga de trabalho',
          'Capacitar em organização',
          'Melhorar planejamento'
        ],
        'baixo': [
          'Manter monitoramento preventivo'
        ]
      },
      'condicoes_ambientais': {
        'critico': [
          'Intervenção imediata no ambiente',
          'Avaliação ergonômica completa',
          'Adequação de infraestrutura'
        ],
        'alto': [
          'Melhorias no ambiente físico',
          'Controle de ruído e iluminação',
          'Equipamentos ergonômicos'
        ],
        'medio': [
          'Monitorar condições ambientais',
          'Ajustes pontuais no ambiente',
          'Treinamento ergonômico'
        ],
        'baixo': [
          'Manter padrões ambientais'
        ]
      }
      // Adicionar outras categorias...
    };

    return actionMap[category]?.[riskLevel] || ['Acompanhar evolução'];
  }
}
