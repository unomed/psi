/**
 * FASE 2: AUTOMAÇÃO DE PLANOS DE AÇÃO
 * RESPONSABILIDADE: Gerar planos de ação automáticos baseados nos critérios unificados
 * 
 * INTEGRAÇÃO:
 * - Usa riskCriteriaUnified.ts para determinar quando gerar planos
 * - Consome nr01_action_templates para templates de ação
 * - Integra com intelligentActionPlanner existente
 * - Executa após process_psychosocial_assessment_auto
 * 
 * TRIGGERING:
 * - Risco Crítico (>80%): Gera plano IMEDIATAMENTE
 * - Risco Alto (>60%): Gera plano em 24h 
 * - Risco Médio/Baixo: Apenas monitora, sem planos automáticos
 * 
 * STATUS: Implementação Fase 2 - substituindo lógica hardcoded
 */

import { supabase } from "@/integrations/supabase/client";
import { getUnifiedRiskCriteria, calculateRiskLevel } from "@/utils/riskCriteriaUnified";
import { intelligentActionPlanner } from "./intelligentActionPlanner";

export interface AutomatedActionPlanResult {
  success: boolean;
  planGenerated: boolean;
  actionPlanId?: string;
  riskLevel: string;
  message: string;
  triggeredBy: 'automatic' | 'manual';
}

export class ActionPlanAutomation {
  
  /**
   * FUNÇÃO PRINCIPAL: Processar automação de planos baseada em critérios unificados
   * ENTRADA: assessment_response_id do trigger de avaliação concluída
   */
  async processAutomaticActionPlan(
    assessmentResponseId: string,
    companyId: string,
    triggeredBy: 'automatic' | 'manual' = 'automatic'
  ): Promise<AutomatedActionPlanResult> {
    
    try {
      console.log('🚀 [FASE 2] Iniciando automação de plano de ação:', {
        assessmentResponseId,
        companyId,
        triggeredBy
      });

      // 1. Buscar dados da avaliação e análise de risco
      const assessmentData = await this.getAssessmentData(assessmentResponseId);
      if (!assessmentData) {
        return {
          success: false,
          planGenerated: false,
          riskLevel: 'unknown',
          message: 'Dados da avaliação não encontrados',
          triggeredBy
        };
      }

      // 2. Calcular nível de risco usando critérios unificados
      const criteria = await getUnifiedRiskCriteria();
      const riskLevel = calculateRiskLevel(assessmentData.score, criteria);
      
      console.log('📊 [FASE 2] Risco calculado:', {
        score: assessmentData.score,
        riskLevel,
        criteria
      });

      // 3. Verificar se deve gerar plano automático
      const shouldGenerate = this.shouldGenerateAutomaticPlan(riskLevel, criteria);
      
      if (!shouldGenerate) {
        return {
          success: true,
          planGenerated: false,
          riskLevel,
          message: `Risco ${riskLevel} não requer plano automático`,
          triggeredBy
        };
      }

      // 4. Verificar se já existe plano para esta avaliação
      const existingPlan = await this.checkExistingActionPlan(assessmentResponseId);
      if (existingPlan) {
        return {
          success: true,
          planGenerated: false,
          riskLevel,
          message: 'Plano de ação já existe para esta avaliação',
          actionPlanId: existingPlan.id,
          triggeredBy
        };
      }

      // 5. Gerar plano de ação usando intelligent planner
      const actionPlan = await this.generateActionPlan(
        assessmentData,
        riskLevel,
        companyId
      );

      // 6. Registrar automação executada
      await this.logAutomationExecution(assessmentResponseId, actionPlan.id, riskLevel);

      // 7. Enviar notificações se configurado
      await this.sendAutomationNotifications(companyId, assessmentData, actionPlan);

      return {
        success: true,
        planGenerated: true,
        riskLevel,
        actionPlanId: actionPlan.id,
        message: `Plano de ação gerado automaticamente para risco ${riskLevel}`,
        triggeredBy
      };

    } catch (error) {
      console.error('❌ [FASE 2] Erro na automação de plano:', error);
      return {
        success: false,
        planGenerated: false,
        riskLevel: 'error',
        message: `Erro na automação: ${error.message}`,
        triggeredBy
      };
    }
  }

  /**
   * Buscar dados da avaliação e análise de risco
   */
  private async getAssessmentData(assessmentResponseId: string) {
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessment_responses')
      .select(`
        id,
        raw_score,
        employee_id,
        employees!inner(
          id,
          name,
          company_id,
          sector_id,
          role_id
        )
      `)
      .eq('id', assessmentResponseId)
      .single();

    if (assessmentError) {
      console.error('Erro ao buscar dados da avaliação:', assessmentError);
      return null;
    }

    // Buscar análise de risco psicossocial se existir
    const { data: riskAnalysis } = await supabase
      .from('psychosocial_risk_analysis')
      .select('id, exposure_level, risk_score, category')
      .eq('assessment_response_id', assessmentResponseId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return {
      assessmentId: assessment.id,
      score: assessment.raw_score || 0,
      employeeId: assessment.employee_id,
      employeeName: assessment.employees.name,
      companyId: assessment.employees.company_id,
      sectorId: assessment.employees.sector_id,
      roleId: assessment.employees.role_id,
      riskAnalysisId: riskAnalysis?.id,
      category: riskAnalysis?.category || 'organizacao_trabalho'
    };
  }

  /**
   * CRITÉRIO UNIFICADO: Determinar se deve gerar plano automático
   * BASEADO EM: critérios da tabela assessment_criteria_settings
   */
  private shouldGenerateAutomaticPlan(riskLevel: string, criteria: any): boolean {
    // Regras da FASE 2:
    // - Crítico (>80%): SEMPRE gera plano
    // - Alto (>medium_threshold): SEMPRE gera plano  
    // - Médio/Baixo: NÃO gera automaticamente
    
    return riskLevel === 'Crítico' || riskLevel === 'Alto';
  }

  /**
   * Verificar se já existe plano para esta avaliação
   */
  private async checkExistingActionPlan(assessmentResponseId: string) {
    const { data } = await supabase
      .from('action_plans')
      .select('id, title, status')
      .eq('assessment_response_id', assessmentResponseId)
      .single();

    return data;
  }

  /**
   * Gerar plano usando intelligent action planner
   */
  private async generateActionPlan(assessmentData: any, riskLevel: string, companyId: string) {
    // Mapear riskLevel para exposure_level do banco
    const exposureLevel = this.mapRiskLevelToExposure(riskLevel);
    
    console.log('📝 [FASE 2] Gerando plano:', {
      category: assessmentData.category,
      exposureLevel,
      companyId,
      sectorId: assessmentData.sectorId
    });

    const actionPlan = await intelligentActionPlanner.generateActionPlan(
      assessmentData.riskAnalysisId || assessmentData.assessmentId,
      assessmentData.category,
      exposureLevel,
      companyId,
      assessmentData.sectorId
    );

    console.log('✅ [FASE 2] Plano gerado:', actionPlan);
    return actionPlan;
  }

  /**
   * Mapear nível de risco unificado para exposure_level do banco
   */
  private mapRiskLevelToExposure(riskLevel: string): string {
    switch (riskLevel) {
      case 'Crítico': return 'critico';
      case 'Alto': return 'alto'; 
      case 'Médio': return 'medio';
      case 'Baixo': return 'baixo';
      default: return 'medio';
    }
  }

  /**
   * Registrar execução da automação para auditoria
   */
  private async logAutomationExecution(
    assessmentResponseId: string, 
    actionPlanId: string, 
    riskLevel: string
  ) {
    // Buscar company_id da avaliação para o log
    const { data: assessment } = await supabase
      .from('assessment_responses')
      .select('employees!inner(company_id)')
      .eq('id', assessmentResponseId)
      .single();

    await supabase
      .from('psychosocial_processing_logs')
      .insert({
        assessment_response_id: assessmentResponseId,
        company_id: assessment?.employees?.company_id || '',
        processing_stage: 'action_plan_generated',
        status: 'completed',
        details: {
          action_plan_id: actionPlanId,
          risk_level: riskLevel,
          automation_phase: 'fase_2',
          generated_automatically: true
        }
      });
  }

  /**
   * Enviar notificações sobre plano gerado
   */
  private async sendAutomationNotifications(
    companyId: string,
    assessmentData: any,
    actionPlan: any
  ) {
    try {
      // Usar sistema de notificações existente
      await supabase.rpc('send_company_notification', {
        p_company_id: companyId,
        p_trigger_event: 'action_plan_generated',
        p_assessment_response_id: assessmentData.assessmentId
      });
      
      console.log('📧 [FASE 2] Notificação enviada para plano:', actionPlan.id);
    } catch (error) {
      console.warn('⚠️ [FASE 2] Erro ao enviar notificação:', error);
      // Não falha a automação por causa de notificação
    }
  }

  /**
   * FUNÇÃO PÚBLICA: Gerar plano manualmente
   * USAGE: Para botões "Gerar Plano" na interface
   */
  async generateManualActionPlan(
    assessmentResponseId: string,
    companyId: string
  ): Promise<AutomatedActionPlanResult> {
    return this.processAutomaticActionPlan(assessmentResponseId, companyId, 'manual');
  }

  /**
   * FUNÇÃO PÚBLICA: Verificar se avaliação requer plano automático
   * USAGE: Para mostrar alertas na interface
   */
  async checkIfRequiresActionPlan(assessmentResponseId: string): Promise<{
    requires: boolean;
    riskLevel: string;
    hasExisting: boolean;
  }> {
    const assessmentData = await this.getAssessmentData(assessmentResponseId);
    if (!assessmentData) {
      return { requires: false, riskLevel: 'unknown', hasExisting: false };
    }

    const criteria = await getUnifiedRiskCriteria();
    const riskLevel = calculateRiskLevel(assessmentData.score, criteria);
    const shouldGenerate = this.shouldGenerateAutomaticPlan(riskLevel, criteria);
    const existingPlan = await this.checkExistingActionPlan(assessmentResponseId);

    return {
      requires: shouldGenerate,
      riskLevel,
      hasExisting: !!existingPlan
    };
  }
}

// Exportar instância singleton
export const actionPlanAutomation = new ActionPlanAutomation();