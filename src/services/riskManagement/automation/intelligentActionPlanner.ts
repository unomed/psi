import { supabase } from "@/integrations/supabase/client";
import { CalculationResult } from "./advancedCalculationEngine";

export interface ActionPlanTemplate {
  id: string;
  category: string;
  risk_level: string;
  sector_type?: string;
  template_name: string;
  description: string;
  actions: ActionItem[];
  timeline_days: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  required_resources: string[];
  success_metrics: string[];
}

export interface ActionItem {
  title: string;
  description: string;
  responsible_role: string;
  estimated_hours: number;
  dependencies: string[];
  timeline_days: number;
  mandatory: boolean;
}

export interface GeneratedActionPlan {
  title: string;
  description: string;
  priority: string;
  estimated_completion_days: number;
  total_estimated_hours: number;
  actions: ActionItem[];
  success_metrics: string[];
  monitoring_frequency: number;
}

export class IntelligentActionPlanner {
  // Gerar plano de ação inteligente baseado nos resultados
  static async generateActionPlan(
    companyId: string,
    sectorId: string,
    roleId: string,
    calculationResults: CalculationResult[],
    assessmentResponseId: string
  ): Promise<GeneratedActionPlan[]> {
    
    const plans: GeneratedActionPlan[] = [];
    
    // Filtrar apenas resultados com risco alto ou crítico
    const highRiskResults = calculationResults.filter(
      result => result.risk_level === 'alto' || result.risk_level === 'critico'
    );

    for (const result of highRiskResults) {
      try {
        const plan = await this.createCategoryActionPlan(
          companyId,
          sectorId,
          roleId,
          result,
          assessmentResponseId
        );
        
        if (plan) {
          plans.push(plan);
        }
      } catch (error) {
        console.error(`Error creating action plan for category ${result.category}:`, error);
      }
    }

    // Se múltiplas categorias de alto risco, criar plano integrado
    if (highRiskResults.length > 1) {
      const integratedPlan = await this.createIntegratedActionPlan(
        companyId,
        sectorId,
        roleId,
        highRiskResults,
        assessmentResponseId
      );
      
      if (integratedPlan) {
        plans.push(integratedPlan);
      }
    }

    return plans;
  }

  // Criar plano de ação para categoria específica
  private static async createCategoryActionPlan(
    companyId: string,
    sectorId: string,
    roleId: string,
    result: CalculationResult,
    assessmentResponseId: string
  ): Promise<GeneratedActionPlan | null> {
    
    try {
      // Buscar template mais adequado - sem conversão de tipos forçada
      const template = await this.findBestTemplate(
        companyId,
        result.category,
        result.risk_level,
        sectorId
      );

      if (!template) {
        // Criar plano básico se não houver template
        return this.createBasicActionPlan(result);
      }

      // Personalizar template baseado nos fatores contribuintes
      const customizedActions = this.customizeActions(
        template.actions,
        result.contributing_factors,
        result.risk_level
      );

      // Calcular cronograma inteligente
      const timeline = this.calculateIntelligentTimeline(
        result.risk_level,
        customizedActions,
        result.confidence_level
      );

      return {
        title: `${template.template_name} - ${result.category}`,
        description: this.generatePlanDescription(template, result),
        priority: this.determinePlanPriority(result.risk_level, result.confidence_level),
        estimated_completion_days: timeline.total_days,
        total_estimated_hours: timeline.total_hours,
        actions: customizedActions,
        success_metrics: this.generateSuccessMetrics(result),
        monitoring_frequency: this.calculateMonitoringFrequency(result.risk_level)
      };

    } catch (error) {
      console.error('Error creating category action plan:', error);
      return null;
    }
  }

  // Buscar o melhor template
  private static async findBestTemplate(
    companyId: string,
    category: string,
    riskLevel: string,
    sectorId: string
  ): Promise<ActionPlanTemplate | null> {
    
    try {
      // Buscar template sem conversão de tipos - usar string diretamente
      const { data: genericTemplates } = await supabase
        .from('nr01_action_templates')
        .select('*')
        .eq('category', category)
        .eq('exposure_level', riskLevel)
        .order('is_mandatory', { ascending: false });

      if (genericTemplates && genericTemplates.length > 0) {
        // Converter manualmente para ActionPlanTemplate
        const template = genericTemplates[0];
        return {
          id: template.id,
          category: template.category,
          risk_level: template.exposure_level,
          template_name: template.template_name,
          description: template.description || '',
          actions: [], // Será preenchido depois
          timeline_days: template.recommended_timeline_days || 90,
          priority: 'medium',
          required_resources: [],
          success_metrics: []
        };
      }

      return null;

    } catch (error) {
      console.error('Error finding template:', error);
      return null;
    }
  }

  // Customizar ações baseado nos fatores contribuintes
  private static customizeActions(
    templateActions: ActionItem[],
    contributingFactors: string[],
    riskLevel: string
  ): ActionItem[] {
    
    const customizedActions = [...templateActions];

    // Adicionar ações específicas baseadas nos fatores
    contributingFactors.forEach(factor => {
      const specificAction = this.getFactorSpecificAction(factor, riskLevel);
      if (specificAction) {
        customizedActions.push(specificAction);
      }
    });

    // Priorizar ações baseado no nível de risco
    return customizedActions
      .sort((a, b) => {
        if (a.mandatory && !b.mandatory) return -1;
        if (!a.mandatory && b.mandatory) return 1;
        return a.timeline_days - b.timeline_days;
      })
      .slice(0, riskLevel === 'critico' ? 10 : 6); // Limitar número de ações
  }

  // Obter ação específica para fator
  private static getFactorSpecificAction(factor: string, riskLevel: string): ActionItem | null {
    const factorActionMap: Record<string, ActionItem> = {
      'Sobrecarga de trabalho': {
        title: 'Redistribuir carga de trabalho',
        description: 'Analisar e redistribuir tarefas para equilibrar demanda',
        responsible_role: 'Gestor direto',
        estimated_hours: riskLevel === 'critico' ? 8 : 4,
        dependencies: [],
        timeline_days: riskLevel === 'critico' ? 3 : 7,
        mandatory: riskLevel === 'critico'
      },
      'Falta de reconhecimento': {
        title: 'Implementar programa de reconhecimento',
        description: 'Criar sistema de feedback e reconhecimento regular',
        responsible_role: 'RH',
        estimated_hours: 16,
        dependencies: ['Aprovação da gestão'],
        timeline_days: 14,
        mandatory: false
      }
      // Adicionar mais mapeamentos...
    };

    return factorActionMap[factor] || null;
  }

  // Calcular cronograma inteligente
  private static calculateIntelligentTimeline(
    riskLevel: string,
    actions: ActionItem[],
    confidenceLevel: number
  ) {
    const urgencyMultiplier = riskLevel === 'critico' ? 0.5 : riskLevel === 'alto' ? 0.7 : 1.0;
    const confidenceMultiplier = confidenceLevel > 80 ? 1.0 : 1.2;

    const totalHours = actions.reduce((sum, action) => sum + action.estimated_hours, 0);
    const baseDays = Math.max(...actions.map(action => action.timeline_days));

    return {
      total_hours: Math.round(totalHours * confidenceMultiplier),
      total_days: Math.round(baseDays * urgencyMultiplier * confidenceMultiplier)
    };
  }

  // Gerar descrição do plano
  private static generatePlanDescription(template: ActionPlanTemplate, result: CalculationResult): string {
    return `${template.description}

Score de risco: ${Math.round(result.sector_adjusted_score)}/100
Nível de confiança: ${result.confidence_level}%
Fatores contribuintes: ${result.contributing_factors.join(', ')}

Este plano foi gerado automaticamente baseado na análise de risco psicossocial conforme NR-01.`;
  }

  // Determinar prioridade do plano
  private static determinePlanPriority(riskLevel: string, confidenceLevel: number): string {
    if (riskLevel === 'critico') return 'critical';
    if (riskLevel === 'alto' && confidenceLevel > 80) return 'high';
    if (riskLevel === 'alto') return 'medium';
    return 'low';
  }

  // Gerar métricas de sucesso
  private static generateSuccessMetrics(result: CalculationResult): string[] {
    const baseMetrics = [
      `Reduzir score de ${result.category} para abaixo de ${Math.round(result.sector_adjusted_score * 0.7)}`,
      'Aumentar satisfação do colaborador em 20%',
      'Reduzir indicadores de estresse'
    ];

    // Adicionar métricas específicas por categoria
    const categoryMetrics: Record<string, string[]> = {
      'exigencias_trabalho': [
        'Reduzir horas extras em 30%',
        'Aumentar produtividade mantendo bem-estar'
      ],
      'exigencias_emocionais': [
        'Reduzir absenteísmo por motivos de saúde',
        'Melhorar avaliação de clima organizacional'
      ]
      // Adicionar outras categorias...
    };

    return [...baseMetrics, ...(categoryMetrics[result.category] || [])];
  }

  // Calcular frequência de monitoramento
  private static calculateMonitoringFrequency(riskLevel: string): number {
    // Retorna dias entre monitoramentos
    switch (riskLevel) {
      case 'critico': return 7;  // Semanal
      case 'alto': return 14;    // Quinzenal
      case 'medio': return 30;   // Mensal
      default: return 90;        // Trimestral
    }
  }

  // Criar plano básico quando não há template
  private static createBasicActionPlan(result: CalculationResult): GeneratedActionPlan {
    const basicActions: ActionItem[] = [
      {
        title: 'Avaliação detalhada',
        description: `Realizar avaliação detalhada da categoria ${result.category}`,
        responsible_role: 'SESMT',
        estimated_hours: 4,
        dependencies: [],
        timeline_days: 7,
        mandatory: true
      },
      {
        title: 'Medidas de controle imediatas',
        description: 'Implementar medidas de controle conforme NR-01',
        responsible_role: 'Gestor direto',
        estimated_hours: 8,
        dependencies: ['Avaliação detalhada'],
        timeline_days: 14,
        mandatory: result.risk_level === 'critico'
      }
    ];

    return {
      title: `Plano de Ação - ${result.category}`,
      description: `Plano básico para controle de risco ${result.risk_level} na categoria ${result.category}`,
      priority: result.risk_level === 'critico' ? 'critical' : 'high',
      estimated_completion_days: 21,
      total_estimated_hours: 12,
      actions: basicActions,
      success_metrics: this.generateSuccessMetrics(result),
      monitoring_frequency: this.calculateMonitoringFrequency(result.risk_level)
    };
  }

  // Criar plano integrado para múltiplas categorias
  private static async createIntegratedActionPlan(
    companyId: string,
    sectorId: string,
    roleId: string,
    results: CalculationResult[],
    assessmentResponseId: string
  ): Promise<GeneratedActionPlan | null> {
    
    try {
      const highestRisk = results.reduce((max, result) => 
        result.sector_adjusted_score > max.sector_adjusted_score ? result : max
      );

      const allFactors = results.flatMap(r => r.contributing_factors);
      const uniqueFactors = [...new Set(allFactors)];

      const integratedActions: ActionItem[] = [
        {
          title: 'Análise integrada de riscos psicossociais',
          description: 'Avaliação holística de múltiplos fatores de risco identificados',
          responsible_role: 'SESMT',
          estimated_hours: 12,
          dependencies: [],
          timeline_days: 5,
          mandatory: true
        },
        {
          title: 'Plano de intervenção multifatorial',
          description: 'Implementação coordenada de medidas para múltiplas categorias',
          responsible_role: 'Comitê de SST',
          estimated_hours: 24,
          dependencies: ['Análise integrada de riscos psicossociais'],
          timeline_days: 21,
          mandatory: true
        }
      ];

      return {
        title: 'Plano Integrado de Controle de Riscos Psicossociais',
        description: `Plano integrado para controle de múltiplos fatores de risco psicossocial identificados. Categorias afetadas: ${results.map(r => r.category).join(', ')}`,
        priority: 'critical',
        estimated_completion_days: 30,
        total_estimated_hours: 36,
        actions: integratedActions,
        success_metrics: [
          'Reduzir scores globais de risco em 25%',
          'Melhorar indicadores de bem-estar organizacional',
          'Aumentar engajamento dos colaboradores'
        ],
        monitoring_frequency: 7 // Semanal para planos integrados
      };

    } catch (error) {
      console.error('Error creating integrated action plan:', error);
      return null;
    }
  }
}
