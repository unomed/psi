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

      // Buscar perguntas e suas associações com fatores
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id, target_factor')
        .in('target_factor', RISK_FACTORS.map(f => f.key));

      if (questionsError) throw questionsError;

      // Criar mapa de pergunta ID -> fator
      const questionToFactorMap = new Map();
      questions?.forEach(q => {
        if (q.target_factor) {
          questionToFactorMap.set(q.id, q.target_factor);
        }
      });

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

          // Tentar extrair do factors_scores primeiro (preferencial)
          if (assessment.factors_scores && assessment.factors_scores[factor.key]) {
            factorScore = assessment.factors_scores[factor.key];
          } 
          // Calcular baseado nas respostas específicas das perguntas do fator
          else if (assessment.response_data) {
            const responses = assessment.response_data;
            const factorQuestions = questions?.filter(q => q.target_factor === factor.key) || [];
            
            if (factorQuestions.length > 0) {
              let totalScore = 0;
              let answeredQuestions = 0;
              
              // Somar apenas as respostas das perguntas deste fator específico
              factorQuestions.forEach(question => {
                const response = responses[question.id];
                if (response !== undefined && response !== null) {
                  // Converter escala Likert (1-5) para porcentagem (0-100)
                  const normalizedScore = ((Number(response) - 1) / 4) * 100;
                  totalScore += normalizedScore;
                  answeredQuestions++;
                }
              });
              
              // Calcular média apenas das perguntas respondidas deste fator
              if (answeredQuestions > 0) {
                factorScore = totalScore / answeredQuestions;
              }
            }
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
        factorData.bySector = Array.from(sectorMap.entries()).map(([sectorName, data]) => {
          const totalScore = data.scores.reduce((a: number, b: number) => a + b, 0);
          const averageScore = data.scores.length > 0 ? totalScore / data.scores.length : 0;
          
          return {
            sectorName,
            baixo: data.baixo,
            medio: data.medio,
            alto: data.alto,
            critico: data.critico,
            averageScore,
            totalScore, // Soma total dos scores
            collectiveScore: averageScore // Score coletivo (média)
          };
        });

        // Processar dados por função
        factorData.byRole = Array.from(roleMap.entries()).map(([roleName, data]) => {
          const totalScore = data.scores.reduce((a: number, b: number) => a + b, 0);
          const averageScore = data.scores.length > 0 ? totalScore / data.scores.length : 0;
          
          return {
            roleName,
            baixo: data.baixo,
            medio: data.medio,
            alto: data.alto,
            critico: data.critico,
            averageScore,
            totalScore, // Soma total dos scores
            collectiveScore: averageScore // Score coletivo (média)
          };
        });

        return factorData;
      });
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}