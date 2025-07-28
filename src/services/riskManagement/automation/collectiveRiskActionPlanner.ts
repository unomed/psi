/**
 * SISTEMA DE PLANOS DE AÇÃO BASEADOS EM RISCOS COLETIVOS
 * Conforme NR-01 e Manual do MTE
 * 
 * CRITÉRIOS DE INTERVENÇÃO:
 * - Risco Coletivo Crítico: >30% de funcionários com risco Alto/Crítico
 * - Risco Coletivo Alto: >20% de funcionários com risco Alto/Crítico  
 * - Risco Coletivo Médio: >10% de funcionários com risco Médio/Alto/Crítico
 * 
 * FOCO: Setor e Função (não individual)
 */

import { supabase } from "@/integrations/supabase/client";

export interface CollectiveRiskAnalysis {
  sectorId: string;
  sectorName: string;
  roleId?: string;
  roleName?: string;
  totalEmployees: number;
  riskDistribution: {
    baixo: number;
    medio: number;
    alto: number;
    critico: number;
  };
  riskPercentages: {
    baixo: number;
    medio: number;
    alto: number;
    critico: number;
  };
  collectiveRiskLevel: 'baixo' | 'medio' | 'alto' | 'critico';
  requiresActionPlan: boolean;
  interventionPriority: 'none' | 'monitoring' | 'preventive' | 'corrective' | 'emergency';
}

export interface CollectiveActionPlanResult {
  success: boolean;
  analysisPerformed: boolean;
  actionPlansGenerated: number;
  collectiveRisks: CollectiveRiskAnalysis[];
  message: string;
}

export class CollectiveRiskActionPlanner {

  /**
   * Analisar riscos coletivos por setor e gerar planos de ação conforme NR-01
   */
  async analyzeCollectiveRisksAndGenerateActionPlans(companyId: string): Promise<CollectiveActionPlanResult> {
    try {
      console.log('🎯 [COLETIVO] Iniciando análise de riscos coletivos para empresa:', companyId);

      // 1. Buscar dados de avaliações psicossociais por setor/função
      const { data: riskAnalyses, error: riskError } = await supabase
        .from('psychosocial_risk_analysis')
        .select(`
          id,
          exposure_level,
          sector_id,
          role_id,
          sectors(name),
          roles(name),
          assessment_responses(
            employees(
              id,
              name,
              sector_id,
              role_id
            )
          )
        `)
        .eq('company_id', companyId)
        .not('exposure_level', 'is', null);

      if (riskError) throw riskError;

      // 2. Agrupar por setor e analisar riscos coletivos
      const sectorAnalysis = this.groupBySectorAndAnalyzeRisk(riskAnalyses || []);
      
      // 3. Gerar planos de ação para setores com risco coletivo identificado
      let actionPlansGenerated = 0;
      const collectiveRisks: CollectiveRiskAnalysis[] = [];

      for (const analysis of sectorAnalysis) {
        collectiveRisks.push(analysis);

        if (analysis.requiresActionPlan) {
          console.log(`🚨 [COLETIVO] Risco coletivo ${analysis.collectiveRiskLevel} identificado no setor ${analysis.sectorName}`);
          
          const actionPlanCreated = await this.generateCollectiveActionPlan(
            companyId,
            analysis
          );

          if (actionPlanCreated) {
            actionPlansGenerated++;
          }
        }
      }

      return {
        success: true,
        analysisPerformed: true,
        actionPlansGenerated,
        collectiveRisks,
        message: `Análise coletiva realizada. ${actionPlansGenerated} planos de ação gerados baseados em riscos coletivos.`
      };

    } catch (error) {
      console.error('❌ [COLETIVO] Erro na análise de riscos coletivos:', error);
      return {
        success: false,
        analysisPerformed: false,
        actionPlansGenerated: 0,
        collectiveRisks: [],
        message: `Erro na análise coletiva: ${error.message}`
      };
    }
  }

  /**
   * Agrupar avaliações por setor e calcular riscos coletivos
   */
  private groupBySectorAndAnalyzeRisk(riskAnalyses: any[]): CollectiveRiskAnalysis[] {
    const sectorMap = new Map<string, {
      sectorId: string;
      sectorName: string;
      employees: Set<string>;
      riskDistribution: { baixo: number; medio: number; alto: number; critico: number };
    }>();

    // Agrupar por setor
    riskAnalyses.forEach(analysis => {
      const sectorId = analysis.sector_id;
      const sectorName = analysis.sectors?.name || 'Setor não identificado';
      const employeeId = analysis.assessment_responses?.employees?.id;
      const exposureLevel = analysis.exposure_level;

      if (!sectorMap.has(sectorId)) {
        sectorMap.set(sectorId, {
          sectorId,
          sectorName,
          employees: new Set(),
          riskDistribution: { baixo: 0, medio: 0, alto: 0, critico: 0 }
        });
      }

      const sector = sectorMap.get(sectorId)!;
      if (employeeId) {
        sector.employees.add(employeeId);
      }

      // Contar distribuição de riscos
      if (exposureLevel && sector.riskDistribution.hasOwnProperty(exposureLevel)) {
        sector.riskDistribution[exposureLevel as keyof typeof sector.riskDistribution]++;
      }
    });

    // Analisar cada setor
    return Array.from(sectorMap.values()).map(sector => {
      const totalEmployees = sector.employees.size;
      const { baixo, medio, alto, critico } = sector.riskDistribution;

      // Calcular porcentagens
      const riskPercentages = {
        baixo: totalEmployees > 0 ? (baixo / totalEmployees) * 100 : 0,
        medio: totalEmployees > 0 ? (medio / totalEmployees) * 100 : 0,
        alto: totalEmployees > 0 ? (alto / totalEmployees) * 100 : 0,
        critico: totalEmployees > 0 ? (critico / totalEmployees) * 100 : 0,
      };

      // Determinar nível de risco coletivo conforme NR-01
      const highRiskPercentage = riskPercentages.alto + riskPercentages.critico;
      const mediumHighRiskPercentage = riskPercentages.medio + riskPercentages.alto + riskPercentages.critico;

      let collectiveRiskLevel: 'baixo' | 'medio' | 'alto' | 'critico';
      let requiresActionPlan = false;
      let interventionPriority: 'none' | 'monitoring' | 'preventive' | 'corrective' | 'emergency';

      if (highRiskPercentage > 30) {
        // >30% com risco Alto/Crítico = Risco Coletivo Crítico
        collectiveRiskLevel = 'critico';
        requiresActionPlan = true;
        interventionPriority = 'emergency';
      } else if (highRiskPercentage > 20) {
        // >20% com risco Alto/Crítico = Risco Coletivo Alto
        collectiveRiskLevel = 'alto';
        requiresActionPlan = true;
        interventionPriority = 'corrective';
      } else if (mediumHighRiskPercentage > 10) {
        // >10% com risco Médio/Alto/Crítico = Risco Coletivo Médio
        collectiveRiskLevel = 'medio';
        requiresActionPlan = true;
        interventionPriority = 'preventive';
      } else {
        collectiveRiskLevel = 'baixo';
        requiresActionPlan = false;
        interventionPriority = 'monitoring';
      }

      return {
        sectorId: sector.sectorId,
        sectorName: sector.sectorName,
        totalEmployees,
        riskDistribution: sector.riskDistribution,
        riskPercentages,
        collectiveRiskLevel,
        requiresActionPlan,
        interventionPriority
      };
    });
  }

  /**
   * Gerar plano de ação específico para risco coletivo identificado
   */
  private async generateCollectiveActionPlan(
    companyId: string, 
    analysis: CollectiveRiskAnalysis
  ): Promise<boolean> {
    try {
      // Verificar se já existe plano ativo para este setor
      const { data: existingPlan } = await supabase
        .from('action_plans')
        .select('id')
        .eq('company_id', companyId)
        .eq('sector_id', analysis.sectorId)
        .in('status', ['draft', 'in_progress'])
        .eq('risk_level', analysis.collectiveRiskLevel)
        .single();

      if (existingPlan) {
        console.log(`ℹ️ [COLETIVO] Plano de ação já existe para setor ${analysis.sectorName}`);
        return false;
      }

      // Criar plano de ação coletivo
      const { data: actionPlan, error: planError } = await supabase
        .from('action_plans')
        .insert({
          company_id: companyId,
          sector_id: analysis.sectorId,
          title: `Plano de Ação Coletivo - ${analysis.sectorName}`,
          description: this.generateActionPlanDescription(analysis),
          status: 'draft',
          priority: this.getPriorityFromRiskLevel(analysis.collectiveRiskLevel),
          risk_level: analysis.collectiveRiskLevel,
          start_date: new Date().toISOString().split('T')[0],
          due_date: this.calculateDueDate(analysis.interventionPriority),
        })
        .select()
        .single();

      if (planError) {
        console.error('❌ [COLETIVO] Erro ao criar plano de ação:', planError);
        return false;
      }

      console.log(`✅ [COLETIVO] Plano de ação criado para setor ${analysis.sectorName}:`, actionPlan.id);
      
      // Criar itens do plano baseados no tipo de intervenção
      await this.createActionPlanItems(actionPlan.id, analysis);

      return true;

    } catch (error) {
      console.error('❌ [COLETIVO] Erro ao gerar plano de ação coletivo:', error);
      return false;
    }
  }

  /**
   * Gerar descrição do plano baseada na análise coletiva
   */
  private generateActionPlanDescription(analysis: CollectiveRiskAnalysis): string {
    const { riskPercentages, collectiveRiskLevel, sectorName, totalEmployees } = analysis;
    const highRiskCount = Math.round((riskPercentages.alto + riskPercentages.critico) * totalEmployees / 100);

    return `
**PLANO DE AÇÃO COLETIVO - RISCO ${collectiveRiskLevel.toUpperCase()}**

**Setor:** ${sectorName}
**Total de Funcionários:** ${totalEmployees}
**Funcionários em Risco Alto/Crítico:** ${highRiskCount} (${(riskPercentages.alto + riskPercentages.critico).toFixed(1)}%)

**Distribuição de Riscos:**
- Baixo: ${riskPercentages.baixo.toFixed(1)}%
- Médio: ${riskPercentages.medio.toFixed(1)}%
- Alto: ${riskPercentages.alto.toFixed(1)}%
- Crítico: ${riskPercentages.critico.toFixed(1)}%

**Intervenção Necessária:** Conforme NR-01, é obrigatória a implementação de medidas de controle coletivo para este setor.
    `.trim();
  }

  /**
   * Criar itens específicos do plano baseados no nível de intervenção
   */
  private async createActionPlanItems(actionPlanId: string, analysis: CollectiveRiskAnalysis): Promise<void> {
    const items = this.getActionItemsByInterventionType(analysis);

    for (const item of items) {
      await supabase.from('action_plan_items').insert({
        action_plan_id: actionPlanId,
        title: item.title,
        description: item.description,
        priority: item.priority,
        estimated_hours: item.estimatedHours,
        due_date: item.dueDate,
        department: analysis.sectorName
      });
    }
  }

  /**
   * Definir itens de ação baseados no tipo de intervenção necessária
   */
  private getActionItemsByInterventionType(analysis: CollectiveRiskAnalysis) {
    const baseDate = new Date();
    
    switch (analysis.interventionPriority) {
      case 'emergency':
        return [
          {
            title: 'Intervenção Imediata - Análise de Causas',
            description: 'Investigar as causas do risco crítico coletivo identificado no setor',
            priority: 'high' as const,
            estimatedHours: 16,
            dueDate: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 dias
          },
          {
            title: 'Implementação de Medidas de Controle Imediatas',
            description: 'Aplicar medidas de controle administrativo e coletivo urgentes',
            priority: 'high' as const,
            estimatedHours: 40,
            dueDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 dias
          },
          {
            title: 'Monitoramento Diário',
            description: 'Estabelecer monitoramento diário da efetividade das medidas',
            priority: 'high' as const,
            estimatedHours: 8,
            dueDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 dias
          }
        ];

      case 'corrective':
        return [
          {
            title: 'Análise das Condições de Trabalho',
            description: 'Realizar análise detalhada das condições psicossociais do setor',
            priority: 'medium' as const,
            estimatedHours: 24,
            dueDate: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 15 dias
          },
          {
            title: 'Implementação de Melhorias Organizacionais',
            description: 'Implementar mudanças organizacionais baseadas na análise',
            priority: 'medium' as const,
            estimatedHours: 60,
            dueDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 dias
          },
          {
            title: 'Capacitação de Lideranças',
            description: 'Treinar gestores sobre gestão de riscos psicossociais',
            priority: 'medium' as const,
            estimatedHours: 16,
            dueDate: new Date(baseDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 45 dias
          }
        ];

      case 'preventive':
        return [
          {
            title: 'Programa de Prevenção Psicossocial',
            description: 'Desenvolver programa preventivo específico para o setor',
            priority: 'low' as const,
            estimatedHours: 32,
            dueDate: new Date(baseDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 60 dias
          },
          {
            title: 'Monitoramento Mensal',
            description: 'Estabelecer rotina de monitoramento mensal dos indicadores',
            priority: 'low' as const,
            estimatedHours: 8,
            dueDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 dias
          }
        ];

      default:
        return [];
    }
  }

  private getPriorityFromRiskLevel(riskLevel: string): 'low' | 'medium' | 'high' {
    switch (riskLevel) {
      case 'critico': return 'high';
      case 'alto': return 'high';
      case 'medio': return 'medium';
      default: return 'low';
    }
  }

  private calculateDueDate(interventionPriority: string): string {
    const baseDate = new Date();
    let days = 90; // padrão

    switch (interventionPriority) {
      case 'emergency': days = 7; break;
      case 'corrective': days = 30; break;
      case 'preventive': days = 60; break;
      case 'monitoring': days = 180; break;
    }

    return new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }
}

// Exportar instância singleton
export const collectiveRiskActionPlanner = new CollectiveRiskActionPlanner();