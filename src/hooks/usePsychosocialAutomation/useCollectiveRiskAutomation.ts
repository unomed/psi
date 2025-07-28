import { useState } from "react";
import { collectiveRiskActionPlanner, CollectiveActionPlanResult } from "@/services/riskManagement/automation/collectiveRiskActionPlanner";
import { toast } from "sonner";

export function useCollectiveRiskAutomation() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<CollectiveActionPlanResult | null>(null);

  /**
   * Executar análise de riscos coletivos e gerar planos de ação conforme NR-01
   */
  const analyzeCollectiveRisks = async (companyId: string): Promise<CollectiveActionPlanResult | null> => {
    if (!companyId) {
      toast.error("ID da empresa é obrigatório");
      return null;
    }

    const targetCompanyId = companyId;
    
    setIsAnalyzing(true);

    try {
      console.log('🎯 Iniciando análise de riscos coletivos para empresa:', targetCompanyId);
      
      const result = await collectiveRiskActionPlanner.analyzeCollectiveRisksAndGenerateActionPlans(targetCompanyId);
      
      setLastAnalysis(result);

      if (result.success) {
        if (result.actionPlansGenerated > 0) {
          toast.success(
            `Análise concluída! ${result.actionPlansGenerated} plano(s) de ação gerado(s) baseado(s) em riscos coletivos.`,
            { duration: 5000 }
          );
        } else {
          toast.info("Análise concluída. Nenhum risco coletivo que exija plano de ação foi identificado.");
        }
      } else {
        toast.error(`Erro na análise: ${result.message}`);
      }

      return result;

    } catch (error) {
      console.error('❌ Erro na análise de riscos coletivos:', error);
      toast.error("Erro inesperado durante a análise de riscos coletivos");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Verificar se há riscos coletivos críticos que exigem atenção imediata
   */
  const checkCriticalCollectiveRisks = async (companyId: string): Promise<boolean> => {
    const result = await analyzeCollectiveRisks(companyId);
    
    if (!result) return false;

    const criticalRisks = result.collectiveRisks.filter(
      risk => risk.collectiveRiskLevel === 'critico' && risk.requiresActionPlan
    );

    return criticalRisks.length > 0;
  };

  /**
   * Obter resumo dos riscos coletivos por setor
   */
  const getCollectiveRiskSummary = () => {
    if (!lastAnalysis) return null;

    return {
      totalSectors: lastAnalysis.collectiveRisks.length,
      sectorsWithRisk: lastAnalysis.collectiveRisks.filter(r => r.requiresActionPlan).length,
      criticalSectors: lastAnalysis.collectiveRisks.filter(r => r.collectiveRiskLevel === 'critico').length,
      highRiskSectors: lastAnalysis.collectiveRisks.filter(r => r.collectiveRiskLevel === 'alto').length,
      actionPlansGenerated: lastAnalysis.actionPlansGenerated,
      analysisTime: new Date().toISOString()
    };
  };

  return {
    // Estados
    isAnalyzing,
    lastAnalysis,
    
    // Funções principais
    analyzeCollectiveRisks,
    checkCriticalCollectiveRisks,
    
    // Utilitários
    getCollectiveRiskSummary
  };
}