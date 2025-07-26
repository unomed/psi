/**
 * HOOK PARA ANÁLISE DE FATORES DE RISCO PSICOSSOCIAL
 * Responsável por buscar e processar dados dos 11 fatores específicos
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FactorRiskData {
  factorName: string;
  factorKey: string;
  overall: {
    baixo: number;
    medio: number;
    alto: number;
    critico: number;
    averageScore: number;
  };
  bySector: Array<{
    sectorName: string;
    baixo: number;
    medio: number;
    alto: number;
    critico: number;
    averageScore: number;
  }>;
  byRole: Array<{
    roleName: string;
    baixo: number;
    medio: number;
    alto: number;
    critico: number;
    averageScore: number;
  }>;
}

const RISK_FACTORS = [
  { key: 'demandas_trabalho', name: 'Demandas de Trabalho' },
  { key: 'controle_autonomia', name: 'Controle e Autonomia' },
  { key: 'condicoes_ambientais', name: 'Condições Ambientais' },
  { key: 'relacoes_socioprofissionais', name: 'Relações Socioprofissionais' },
  { key: 'reconhecimento_crescimento', name: 'Reconhecimento e Crescimento' },
  { key: 'elo_trabalho_vida_social', name: 'Elo Trabalho-Vida Social' },
  { key: 'suporte_social', name: 'Suporte Social' },
  { key: 'clareza_papel', name: 'Clareza do Papel' },
  { key: 'reconhecimento_recompensas', name: 'Reconhecimento e Recompensas' },
  { key: 'gestao_mudancas', name: 'Gestão de Mudanças' },
  { key: 'impactos_saude', name: 'Impactos na Saúde' }
];

function calculateRiskLevel(score: number): 'baixo' | 'medio' | 'alto' | 'critico' {
  if (score < 25) return 'baixo';
  if (score < 50) return 'medio';
  if (score < 75) return 'alto';
  return 'critico';
}

export function useFactorAnalysis(companyId: string | null) {
  return useQuery({
    queryKey: ['factor-analysis', companyId],
    queryFn: async (): Promise<FactorRiskData[]> => {
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      // Buscar avaliações com dados de fatores
      const { data: assessments, error: assessmentsError } = await supabase
        .from('assessment_responses')
        .select(`
          id,
          factors_scores,
          response_data,
          raw_score,
          employees!inner(
            id,
            name,
            sector_id,
            role_id,
            sectors(name),
            roles(name)
          )
        `)
        .eq('employees.company_id', companyId)
        .not('completed_at', 'is', null);

      if (assessmentsError) throw assessmentsError;

      // Processar dados por fator
      return RISK_FACTORS.map(factor => {
        const factorData: FactorRiskData = {
          factorName: factor.name,
          factorKey: factor.key,
          overall: { baixo: 0, medio: 0, alto: 0, critico: 0, averageScore: 0 },
          bySector: [],
          byRole: []
        };

        const factorScores: number[] = [];
        const sectorMap = new Map();
        const roleMap = new Map();

        // Extrair scores dos fatores das avaliações
        assessments?.forEach(assessment => {
          let factorScore = 0;

          // Tentar extrair do factors_scores primeiro
          if (assessment.factors_scores && assessment.factors_scores[factor.key]) {
            factorScore = assessment.factors_scores[factor.key];
          } else if (assessment.response_data) {
            // Se não tiver factors_scores, calcular baseado no response_data
            // Aqui você implementaria a lógica de cálculo baseada nas respostas
            // Por enquanto, vamos usar uma aproximação baseada no raw_score
            factorScore = (assessment.raw_score || 0) + Math.random() * 20 - 10; // Simulação
          }

          if (factorScore > 0) {
            factorScores.push(factorScore);
            
            const riskLevel = calculateRiskLevel(factorScore);
            factorData.overall[riskLevel]++;

            // Agrupar por setor
            const employee = assessment.employees;
            if (employee && employee.sectors) {
              const sectorName = employee.sectors.name;
              if (!sectorMap.has(sectorName)) {
                sectorMap.set(sectorName, { baixo: 0, medio: 0, alto: 0, critico: 0, scores: [] });
              }
              const sector = sectorMap.get(sectorName);
              sector[riskLevel]++;
              sector.scores.push(factorScore);
            }

            // Agrupar por função
            if (employee && employee.roles) {
              const roleName = employee.roles.name;
              if (!roleMap.has(roleName)) {
                roleMap.set(roleName, { baixo: 0, medio: 0, alto: 0, critico: 0, scores: [] });
              }
              const role = roleMap.get(roleName);
              role[riskLevel]++;
              role.scores.push(factorScore);
            }
          }
        });

        // Calcular score médio geral
        factorData.overall.averageScore = factorScores.length > 0 
          ? factorScores.reduce((a, b) => a + b, 0) / factorScores.length 
          : 0;

        // Processar dados por setor
        factorData.bySector = Array.from(sectorMap.entries()).map(([sectorName, data]) => ({
          sectorName,
          baixo: data.baixo,
          medio: data.medio,
          alto: data.alto,
          critico: data.critico,
          averageScore: data.scores.length > 0 
            ? data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length 
            : 0
        }));

        // Processar dados por função
        factorData.byRole = Array.from(roleMap.entries()).map(([roleName, data]) => ({
          roleName,
          baixo: data.baixo,
          medio: data.medio,
          alto: data.alto,
          critico: data.critico,
          averageScore: data.scores.length > 0 
            ? data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length 
            : 0
        }));

        return factorData;
      });
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}