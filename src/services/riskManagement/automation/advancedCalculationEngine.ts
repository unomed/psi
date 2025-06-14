
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

      // Buscar configurações de peso por categoria
      const { data: categoryWeights } = await supabase
        .from('psychosocial_category_weights')
        .select('*')
        .eq('company_id', companyId);

      // Buscar perfil de risco do setor
      const { data: sectorProfile } = await supabase
        .from('sector_risk_profiles')
        .select('*')
        .eq('company_id', companyId)
        .eq('sector_id', assessmentData.employees.sector_id)
        .single();

      const responses = assessmentData.response_data as Record<string, any>;
      const results: CalculationResult[] = [];

      // Categorias principais do Manual MTE
      const categories = [
        'exigencias_trabalho',
        'exigencias_emocionais', 
        'autonomia_desenvolvimento',
        'relacoes_sociais_lideranca',
        'reconhecimento_conflitos',
        'inseguranca'
      ];

      for (const category of categories) {
        const categoryWeight = categoryWeights?.find(cw => cw.category === category);
        const result = await this.calculateCategoryRisk(
          category,
          responses,
          categoryWeight,
          sectorProfile,
          assessmentData.employees.sector_id,
          assessmentData.employees.role_id
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
      'exigencias_trabalho': ['q1', 'q2', 'q3', 'q4', 'q5'],
      'exigencias_emocionais': ['q6', 'q7', 'q8', 'q9'],
      'autonomia_desenvolvimento': ['q10', 'q11', 'q12', 'q13'],
      'relacoes_sociais_lideranca': ['q14', 'q15', 'q16', 'q17'],
      'reconhecimento_conflitos': ['q18', 'q19', 'q20', 'q21'],
      'inseguranca': ['q22', 'q23', 'q24', 'q25']
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
      'exigencias_trabalho': [
        'Sobrecarga de trabalho',
        'Prazos irrealistas',
        'Complexidade excessiva',
        'Interrupções frequentes'
      ],
      'exigencias_emocionais': [
        'Lidar com público difícil',
        'Pressão emocional',
        'Conflitos interpessoais',
        'Responsabilidade por outros'
      ],
      'autonomia_desenvolvimento': [
        'Baixa autonomia decisória',
        'Falta de desenvolvimento',
        'Tarefas monótonas',
        'Pouco controle sobre trabalho'
      ],
      'relacoes_sociais_lideranca': [
        'Conflitos com chefia',
        'Isolamento social',
        'Falta de suporte',
        'Comunicação deficiente'
      ],
      'reconhecimento_conflitos': [
        'Falta de reconhecimento',
        'Conflitos de valores',
        'Injustiça organizacional',
        'Desvalorização profissional'
      ],
      'inseguranca': [
        'Insegurança no emprego',
        'Mudanças organizacionais',
        'Falta de estabilidade',
        'Incerteza sobre futuro'
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
      // Buscar templates de ação específicos
      const { data: actionTemplates } = await supabase
        .from('nr01_action_templates')
        .select('*')
        .eq('category', category)
        .eq('exposure_level', riskLevel);

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
      'exigencias_trabalho': {
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
      'exigencias_emocionais': {
        'critico': [
          'Suporte psicológico imediato',
          'Afastamento temporário se necessário',
          'Intervenção especializada'
        ],
        'alto': [
          'Programa de apoio emocional',
          'Treinamento em gestão de estresse',
          'Suporte psicológico'
        ],
        'medio': [
          'Workshops de bem-estar',
          'Grupos de apoio',
          'Técnicas de relaxamento'
        ],
        'baixo': [
          'Atividades de bem-estar preventivas'
        ]
      }
      // Adicionar outras categorias...
    };

    return actionMap[category]?.[riskLevel] || ['Acompanhar evolução'];
  }
}
