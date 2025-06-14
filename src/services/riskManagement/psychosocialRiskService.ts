
import { supabase } from "@/integrations/supabase/client";

export interface PsychosocialRiskResult {
  category: string;
  risk_score: number;
  exposure_level: string;
  recommended_actions: string[];
}

export interface SectorRiskSummary {
  sector_id: string;
  sector_name: string;
  total_employees: number;
  high_risk_categories: string[];
  avg_risk_score: number;
  priority_level: 'low' | 'medium' | 'high' | 'critical';
}

// Processar avaliação psicossocial e gerar análise de risco automática
export async function processAssessmentForPsychosocialRisk(
  assessmentResponseId: string,
  companyId: string
) {
  try {
    // 1. Calcular riscos psicossociais por categoria
    const { data: riskResults, error: riskError } = await supabase.rpc('calculate_psychosocial_risk', {
      p_assessment_response_id: assessmentResponseId,
      p_company_id: companyId
    });

    if (riskError) throw riskError;

    // 2. Buscar dados da avaliação
    const { data: response, error: responseError } = await supabase
      .from('assessment_responses')
      .select(`
        *,
        employee:employees(
          id,
          name,
          sector_id,
          role_id,
          company_id
        )
      `)
      .eq('id', assessmentResponseId)
      .single();

    if (responseError) throw responseError;

    const employee = response.employee as any;
    const createdAnalyses = [];

    // 3. Criar análises de risco para cada categoria
    for (const riskResult of riskResults) {
      const { data: analysis, error: analysisError } = await supabase
        .from('psychosocial_risk_analysis')
        .insert({
          company_id: companyId,
          sector_id: employee?.sector_id,
          role_id: employee?.role_id,
          assessment_response_id: assessmentResponseId,
          category: riskResult.category,
          exposure_level: riskResult.exposure_level,
          risk_score: riskResult.risk_score,
          recommended_actions: riskResult.recommended_actions,
          mandatory_measures: riskResult.exposure_level === 'alto' || riskResult.exposure_level === 'critico' 
            ? riskResult.recommended_actions 
            : [],
          evaluation_date: new Date().toISOString().split('T')[0],
          next_evaluation_date: calculateNextEvaluationDate(riskResult.exposure_level),
          status: 'identified'
        })
        .select()
        .single();

      if (analysisError) {
        console.error('Error creating psychosocial risk analysis:', analysisError);
        continue;
      }

      createdAnalyses.push(analysis);

      // 4. Gerar planos de ação automáticos para riscos altos/críticos
      if (riskResult.exposure_level === 'alto' || riskResult.exposure_level === 'critico') {
        try {
          await supabase.rpc('generate_nr01_action_plan', {
            p_risk_analysis_id: analysis.id
          });
        } catch (planError) {
          console.error('Error generating action plan for risk analysis:', planError);
        }
      }
    }

    return createdAnalyses;
  } catch (error) {
    console.error("Error processing assessment for psychosocial risk:", error);
    throw error;
  }
}

// Obter resumo de riscos psicossociais por setor
export async function getPsychosocialRisksBySector(companyId: string): Promise<SectorRiskSummary[]> {
  try {
    const { data, error } = await supabase
      .from('psychosocial_risk_analysis')
      .select(`
        *,
        sectors(id, name),
        roles(id, name)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Agrupar por setor
    const sectorMap = new Map<string, {
      sector_id: string;
      sector_name: string;
      analyses: any[];
      employees: Set<string>;
    }>();

    data?.forEach((analysis: any) => {
      if (!analysis.sector_id) return;

      const sectorKey = analysis.sector_id;
      if (!sectorMap.has(sectorKey)) {
        sectorMap.set(sectorKey, {
          sector_id: analysis.sector_id,
          sector_name: analysis.sectors?.name || 'Setor Desconhecido',
          analyses: [],
          employees: new Set()
        });
      }

      const sector = sectorMap.get(sectorKey)!;
      sector.analyses.push(analysis);
      
      // Contar funcionários únicos (baseado em assessment_response_id)
      if (analysis.assessment_response_id) {
        sector.employees.add(analysis.assessment_response_id);
      }
    });

    // Calcular métricas por setor
    return Array.from(sectorMap.values()).map(sector => {
      const highRiskAnalyses = sector.analyses.filter(a => 
        a.exposure_level === 'alto' || a.exposure_level === 'critico'
      );

      const avgRiskScore = sector.analyses.reduce((sum, a) => sum + a.risk_score, 0) / sector.analyses.length;

      const highRiskCategories = [...new Set(highRiskAnalyses.map(a => a.category))];

      let priorityLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (highRiskAnalyses.some(a => a.exposure_level === 'critico')) {
        priorityLevel = 'critical';
      } else if (highRiskAnalyses.length > 2) {
        priorityLevel = 'high';
      } else if (highRiskAnalyses.length > 0) {
        priorityLevel = 'medium';
      }

      return {
        sector_id: sector.sector_id,
        sector_name: sector.sector_name,
        total_employees: sector.employees.size,
        high_risk_categories: highRiskCategories,
        avg_risk_score: avgRiskScore,
        priority_level: priorityLevel
      };
    }).sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority_level] - priorityOrder[a.priority_level];
    });
  } catch (error) {
    console.error("Error getting psychosocial risks by sector:", error);
    return [];
  }
}

// Calcular próxima data de avaliação baseada no nível de exposição
function calculateNextEvaluationDate(exposureLevel: string): string {
  const today = new Date();
  let daysToAdd = 365; // Padrão: 1 ano

  switch (exposureLevel) {
    case 'critico':
      daysToAdd = 30; // 1 mês
      break;
    case 'alto':
      daysToAdd = 90; // 3 meses
      break;
    case 'medio':
      daysToAdd = 180; // 6 meses
      break;
    case 'baixo':
      daysToAdd = 365; // 1 ano
      break;
  }

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysToAdd);
  return nextDate.toISOString().split('T')[0];
}

// Obter categorias de risco com traduções para interface
export function getPsychosocialCategories() {
  return {
    'organizacao_trabalho': {
      label: 'Organização do Trabalho',
      description: 'Ritmo, jornada, autonomia e controle sobre as atividades',
      color: '#3B82F6'
    },
    'condicoes_ambientais': {
      label: 'Condições Ambientais',
      description: 'Ambiente físico, equipamentos e recursos de trabalho',
      color: '#10B981'
    },
    'relacoes_socioprofissionais': {
      label: 'Relações Socioprofissionais',
      description: 'Comunicação, liderança e relacionamentos interpessoais',
      color: '#F59E0B'
    },
    'reconhecimento_crescimento': {
      label: 'Reconhecimento e Crescimento',
      description: 'Valorização profissional e oportunidades de desenvolvimento',
      color: '#8B5CF6'
    },
    'elo_trabalho_vida_social': {
      label: 'Elo Trabalho-Vida Social',
      description: 'Equilíbrio entre trabalho e vida pessoal',
      color: '#EF4444'
    }
  };
}

// Obter níveis de exposição com traduções
export function getExposureLevels() {
  return {
    'baixo': {
      label: 'Baixo',
      color: '#10B981',
      description: 'Risco controlado - monitoramento periódico'
    },
    'medio': {
      label: 'Médio',
      color: '#F59E0B',
      description: 'Medidas preventivas necessárias'
    },
    'alto': {
      label: 'Alto',
      color: '#EF4444',
      description: 'Ação imediata obrigatória'
    },
    'critico': {
      label: 'Crítico',
      color: '#7C2D12',
      description: 'Intervenção emergencial necessária'
    }
  };
}
