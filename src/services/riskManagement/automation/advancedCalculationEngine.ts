
import { supabase } from "@/integrations/supabase/client";
import { ActionItem } from "./intelligentActionPlanner";
import type { Database } from "@/integrations/supabase/types";

export interface RiskCalculationInput {
  assessmentResponseId: string;
  companyId: string;
  sectorId?: string;
  roleId?: string;
  responses: Record<string, any>;
}

export interface RiskCalculationResult {
  category: string;
  riskScore: number;
  exposureLevel: 'baixo' | 'medio' | 'alto' | 'critico';
  contributingFactors: string[];
  recommendedActions: string[];
  confidence: number; // 0-1 scale
  sectorAdjustment?: number;
  roleAdjustment?: number;
}

export interface CalculationContext {
  companyThresholds: {
    threshold_low: number;
    threshold_medium: number;
    threshold_high: number;
  };
  sectorProfile?: {
    risk_multipliers: Record<string, number>;
    baseline_scores: Record<string, number>;
  };
  categoryWeights: Record<string, number>;
}

type PsychosocialRiskCategory = Database['public']['Enums']['psychosocial_risk_category'];
type PsychosocialExposureLevel = Database['public']['Enums']['psychosocial_exposure_level'];

export class AdvancedCalculationEngine {
  
  async calculatePsychosocialRisk(input: RiskCalculationInput): Promise<RiskCalculationResult[]> {
    const context = await this.buildCalculationContext(input);
    const results: RiskCalculationResult[] = [];

    // Get psychosocial categories to calculate
    const categories = await this.getPsychosocialCategories();

    for (const category of categories) {
      const result = await this.calculateCategoryRisk(input, category, context);
      results.push(result);
    }

    return results;
  }

  private async buildCalculationContext(input: RiskCalculationInput): Promise<CalculationContext> {
    // Get company thresholds
    const { data: config } = await supabase
      .from('psychosocial_risk_config')
      .select('threshold_low, threshold_medium, threshold_high')
      .eq('company_id', input.companyId)
      .single();

    let companyThresholds = {
      threshold_low: 25,
      threshold_medium: 50,
      threshold_high: 75
    };

    if (config) {
      companyThresholds = {
        threshold_low: config.threshold_low,
        threshold_medium: config.threshold_medium,
        threshold_high: config.threshold_high
      };
    }

    // Get sector profile if available
    let sectorProfile;
    if (input.sectorId) {
      const { data: profile } = await supabase
        .from('sector_risk_profiles')
        .select('risk_multipliers, baseline_scores')
        .eq('company_id', input.companyId)
        .eq('sector_id', input.sectorId)
        .single();

      sectorProfile = profile || undefined;
    }

    // Get category weights
    const { data: weights } = await supabase
      .from('psychosocial_category_weights')
      .select('category, weight')
      .eq('company_id', input.companyId);

    const categoryWeights: Record<string, number> = {};
    weights?.forEach(w => {
      categoryWeights[w.category] = w.weight;
    });

    return {
      companyThresholds,
      sectorProfile,
      categoryWeights
    };
  }

  private async getPsychosocialCategories(): Promise<string[]> {
    // Standard NR-01 psychosocial risk categories
    return [
      'organizacao_trabalho',
      'condicoes_ambientais',
      'relacoes_socioprofissionais',
      'reconhecimento_crescimento',
      'autonomia_controle'
    ];
  }

  private async calculateCategoryRisk(
    input: RiskCalculationInput,
    category: string,
    context: CalculationContext
  ): Promise<RiskCalculationResult> {
    
    // Extract responses for this category
    const categoryResponses = this.extractCategoryResponses(input.responses, category);
    
    // Calculate base score
    let baseScore = this.calculateBaseScore(categoryResponses);
    
    // Apply sector adjustments
    const sectorAdjustment = this.applySectorAdjustment(baseScore, category, context.sectorProfile);
    
    // Apply company-specific weights
    const weight = context.categoryWeights[category] || 1.0;
    const adjustedScore = (baseScore + sectorAdjustment) * weight;
    
    // Determine exposure level
    const exposureLevel = this.determineExposureLevel(adjustedScore, context.companyThresholds);
    
    // Identify contributing factors
    const contributingFactors = this.identifyContributingFactors(categoryResponses, category);
    
    // Generate recommendations
    const recommendedActions = await this.generateRecommendations(category, exposureLevel, contributingFactors);
    
    // Calculate confidence score
    const confidence = this.calculateConfidence(categoryResponses, adjustedScore);

    return {
      category,
      riskScore: Math.round(adjustedScore * 100) / 100,
      exposureLevel,
      contributingFactors,
      recommendedActions,
      confidence,
      sectorAdjustment
    };
  }

  private extractCategoryResponses(responses: Record<string, any>, category: string): Record<string, number> {
    // Extract responses related to specific category
    // This would map question IDs to their category
    const categoryResponses: Record<string, number> = {};
    
    // Simple mapping - in real implementation, this would be based on question categorization
    Object.entries(responses).forEach(([questionId, value]) => {
      if (this.questionBelongsToCategory(questionId, category)) {
        categoryResponses[questionId] = typeof value === 'number' ? value : parseInt(value) || 0;
      }
    });

    return categoryResponses;
  }

  private questionBelongsToCategory(questionId: string, category: string): boolean {
    // Simplified category mapping - in real implementation, this would query the database
    const categoryMappings: Record<string, string[]> = {
      'organizacao_trabalho': ['q1', 'q2', 'q3', 'q4', 'q5'],
      'condicoes_ambientais': ['q6', 'q7', 'q8', 'q9', 'q10'],
      'relacoes_socioprofissionais': ['q11', 'q12', 'q13', 'q14', 'q15'],
      'reconhecimento_crescimento': ['q16', 'q17', 'q18', 'q19', 'q20'],
      'autonomia_controle': ['q21', 'q22', 'q23', 'q24', 'q25']
    };

    return categoryMappings[category]?.includes(questionId) || false;
  }

  private calculateBaseScore(responses: Record<string, number>): number {
    if (Object.keys(responses).length === 0) return 0;
    
    const values = Object.values(responses);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    
    // Convert to 0-100 scale (assuming 1-5 Likert scale)
    return (average - 1) * 25;
  }

  private applySectorAdjustment(baseScore: number, category: string, sectorProfile?: any): number {
    if (!sectorProfile?.risk_multipliers) return 0;
    
    const multiplier = sectorProfile.risk_multipliers[category] || 1.0;
    const baseline = sectorProfile.baseline_scores?.[category] || 0;
    
    return (baseScore * multiplier) - baseScore + baseline;
  }

  private determineExposureLevel(
    score: number, 
    thresholds: { threshold_low: number; threshold_medium: number; threshold_high: number }
  ): 'baixo' | 'medio' | 'alto' | 'critico' {
    if (score <= thresholds.threshold_low) return 'baixo';
    if (score <= thresholds.threshold_medium) return 'medio';
    if (score <= thresholds.threshold_high) return 'alto';
    return 'critico';
  }

  private identifyContributingFactors(responses: Record<string, number>, category: string): string[] {
    const factors: string[] = [];
    
    // Identify high-scoring factors that contribute to risk
    Object.entries(responses).forEach(([questionId, score]) => {
      if (score >= 4) { // High risk response
        factors.push(this.getFactorDescription(questionId, category));
      }
    });

    return factors.filter(Boolean);
  }

  private getFactorDescription(questionId: string, category: string): string {
    // Map question IDs to human-readable factor descriptions
    const factorMappings: Record<string, string> = {
      'q1': 'Sobrecarga de trabalho',
      'q2': 'Ritmo de trabalho excessivo',
      'q3': 'Pressão temporal constante',
      'q6': 'Ambiente físico inadequado',
      'q7': 'Ruído excessivo',
      'q11': 'Conflitos interpessoais',
      'q12': 'Falta de apoio social',
      // ... more mappings
    };

    return factorMappings[questionId] || '';
  }

  private async generateRecommendations(
    category: string, 
    exposureLevel: string, 
    contributingFactors: string[]
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Get template recommendations with proper type casting
    const { data: templates } = await supabase
      .from('nr01_action_templates')
      .select('template_actions')
      .eq('category', category as PsychosocialRiskCategory)
      .eq('exposure_level', exposureLevel as PsychosocialExposureLevel)
      .limit(1);

    if (templates?.[0]?.template_actions) {
      try {
        const actionsData = templates[0].template_actions;
        let actions: ActionItem[] = [];
        
        if (Array.isArray(actionsData)) {
          actions = actionsData as unknown as ActionItem[];
        } else if (typeof actionsData === 'string') {
          actions = JSON.parse(actionsData);
        }
        
        recommendations.push(...actions.map(action => action.title));
      } catch (error) {
        console.error('Error parsing template actions:', error);
      }
    }

    // Add factor-specific recommendations
    contributingFactors.forEach(factor => {
      const specificRec = this.getFactorSpecificRecommendation(factor);
      if (specificRec) recommendations.push(specificRec);
    });

    return recommendations;
  }

  private getFactorSpecificRecommendation(factor: string): string {
    const recommendations: Record<string, string> = {
      'Sobrecarga de trabalho': 'Redistribuir tarefas e revisar capacidade da equipe',
      'Ritmo de trabalho excessivo': 'Implementar pausas regulares e revisar metas',
      'Ambiente físico inadequado': 'Melhorar condições ambientais de trabalho',
      'Conflitos interpessoais': 'Implementar programa de mediação de conflitos'
    };

    return recommendations[factor] || '';
  }

  private calculateConfidence(responses: Record<string, number>, finalScore: number): number {
    // Calculate confidence based on response consistency and completeness
    const responseCount = Object.keys(responses).length;
    const expectedResponses = 5; // Expected responses per category
    
    const completeness = Math.min(responseCount / expectedResponses, 1.0);
    
    // Calculate variance to assess consistency
    const values = Object.values(responses);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const consistency = Math.max(0, 1 - (variance / 5)); // Normalize variance
    
    return (completeness * 0.6 + consistency * 0.4);
  }
}

export const advancedCalculationEngine = new AdvancedCalculationEngine();
