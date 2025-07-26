/**
 * HOOK: Automação de Planos de Ação - Fase 2
 * RESPONSABILIDADE: Interface React para automação de planos
 * 
 * FUNCIONALIDADES:
 * - Gerar planos manuais via botão
 * - Verificar se avaliação requer plano 
 * - Monitorar status de automação
 * - Integrar com React Query para cache
 * 
 * USAGE:
 * - AssessmentResultDialog: botão "Gerar Plano de Ação"
 * - PlanoAcao page: integração com NR-01 plans
 * - Dashboard: alertas de planos pendentes
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actionPlanAutomation, AutomatedActionPlanResult } from "@/services/riskManagement/automation/actionPlanAutomation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function useActionPlanAutomation() {
  const queryClient = useQueryClient();
  const { userCompanies } = useAuth();
  const companyId = userCompanies?.[0]?.companyId;

  /**
   * MUTATION: Gerar plano de ação manual
   * TRIGGER: Botão "Gerar Plano de Ação" nas interfaces
   */
  const generateManualPlan = useMutation({
    mutationFn: async (assessmentResponseId: string) => {
      if (!companyId) throw new Error('Company ID não encontrado');
      
      console.log('🎯 [HOOK] Gerando plano manual:', assessmentResponseId);
      return actionPlanAutomation.generateManualActionPlan(assessmentResponseId, companyId);
    },
    onSuccess: (result: AutomatedActionPlanResult) => {
      if (result.success && result.planGenerated) {
        toast.success(`Plano de ação gerado com sucesso! Risco: ${result.riskLevel}`);
        
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['actionPlans'] });
        queryClient.invalidateQueries({ queryKey: ['nr01ActionPlans'] });
        queryClient.invalidateQueries({ queryKey: ['psychosocialProcessingLogs'] });
        
        console.log('✅ [HOOK] Plano gerado:', result);
      } else {
        toast.info(result.message);
        console.log('ℹ️ [HOOK] Plano não gerado:', result.message);
      }
    },
    onError: (error: Error) => {
      console.error('❌ [HOOK] Erro ao gerar plano:', error);
      toast.error(`Erro ao gerar plano de ação: ${error.message}`);
    }
  });

  /**
   * QUERY: Verificar se avaliação requer plano automático
   * USAGE: Para mostrar alertas e status na interface
   */
  const checkActionPlanRequirements = (assessmentResponseId?: string) => {
    return useQuery({
      queryKey: ['actionPlanRequirements', assessmentResponseId],
      queryFn: () => {
        if (!assessmentResponseId) {
          return { requires: false, riskLevel: 'unknown', hasExisting: false };
        }
        
        console.log('🔍 [HOOK] Verificando requisitos de plano:', assessmentResponseId);
        return actionPlanAutomation.checkIfRequiresActionPlan(assessmentResponseId);
      },
      enabled: !!assessmentResponseId,
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
      refetchOnWindowFocus: false
    });
  };

  /**
   * FUNÇÃO: Processar automação completa (para triggers internos)
   * USAGE: Integração com processingService quando avaliação é concluída
   */
  const processAutomaticPlan = useMutation({
    mutationFn: async ({ 
      assessmentResponseId, 
      companyId: targetCompanyId 
    }: { 
      assessmentResponseId: string; 
      companyId?: string; 
    }) => {
      const finalCompanyId = targetCompanyId || companyId;
      if (!finalCompanyId) throw new Error('Company ID é obrigatório');
      
      console.log('⚡ [HOOK] Processamento automático:', {
        assessmentResponseId,
        companyId: finalCompanyId
      });
      
      return actionPlanAutomation.processAutomaticActionPlan(
        assessmentResponseId, 
        finalCompanyId, 
        'automatic'
      );
    },
    onSuccess: (result: AutomatedActionPlanResult) => {
      if (result.success && result.planGenerated) {
        // Não mostrar toast para automação - apenas logar
        console.log('🤖 [HOOK] Automação concluída:', result);
        
        // Invalidar caches silenciosamente  
        queryClient.invalidateQueries({ queryKey: ['actionPlans'] });
        queryClient.invalidateQueries({ queryKey: ['nr01ActionPlans'] });
      } else {
        console.log('ℹ️ [HOOK] Automação não gerou plano:', result.message);
      }
    },
    onError: (error: Error) => {
      console.error('❌ [HOOK] Erro na automação:', error);
      // Não mostrar toast de erro para automação para não interferir na UX
    }
  });

  /**
   * FUNÇÃO UTILITÁRIA: Verificar se deve mostrar botão "Gerar Plano"
   */
  const shouldShowGenerateButton = (
    riskLevel?: string,
    hasExistingPlan?: boolean
  ): boolean => {
    if (hasExistingPlan) return false;
    return riskLevel === 'Crítico' || riskLevel === 'Alto';
  };

  /**
   * FUNÇÃO UTILITÁRIA: Obter mensagem de status do plano
   */
  const getActionPlanStatusMessage = (
    requires: boolean,
    hasExisting: boolean,
    riskLevel: string
  ): string => {
    if (hasExisting) {
      return 'Plano de ação já existe para esta avaliação';
    }
    
    if (requires) {
      return `Risco ${riskLevel} requer plano de ação conforme NR-01`;
    }
    
    return `Risco ${riskLevel} - monitoramento contínuo recomendado`;
  };

  return {
    // Mutations
    generateManualPlan,
    processAutomaticPlan,
    
    // Queries
    checkActionPlanRequirements,
    
    // Utilities
    shouldShowGenerateButton,
    getActionPlanStatusMessage,
    
    // Status
    isGenerating: generateManualPlan.isPending,
    isProcessing: processAutomaticPlan.isPending
  };
}