import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface FRPRTReportData {
  assessments: any[];
  riskAnalyses: any[];
  actionPlans: any[];
  company: any;
  sectors: any[];
  roles: any[];
  frprtMetrics: {
    totalAssessments: number;
    risksByCategory: Record<string, any>;
    highRiskCategories: string[];
    overallRiskLevel: string;
  };
  filteredData: {
    assessments: any[];
    riskAnalyses: any[];
  };
}

export function useFRPRTReportData(
  companyId?: string, 
  periodStart?: string, 
  periodEnd?: string,
  selectedSector?: string,
  selectedRole?: string
) {
  const { userRole } = useAuth();

  const { data: frprtData, isLoading, error } = useQuery({
    queryKey: ['frprt-report-data', companyId, periodStart, periodEnd, selectedSector, selectedRole],
    queryFn: async (): Promise<FRPRTReportData> => {
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      try {
        // Buscar dados da empresa
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();

        if (companyError) throw companyError;

        // Buscar setores da empresa
        const { data: sectors, error: sectorsError } = await supabase
          .from('sectors')
          .select('id, name')
          .eq('company_id', companyId);

        if (sectorsError) throw sectorsError;

        // Buscar funções da empresa
        const { data: roles, error: rolesError } = await supabase
          .from('roles')
          .select('id, name')
          .eq('company_id', companyId);

        if (rolesError) throw rolesError;

        // Buscar avaliações com joins completos
        let assessmentsQuery = supabase
          .from('assessment_responses')
          .select(`
            *,
            employees!inner(
              id, name, company_id, role_id, sector_id,
              roles(id, name),
              sectors(id, name)
            ),
            checklist_templates(id, title, type)
          `)
          .eq('employees.company_id', companyId);

        // Aplicar filtros de período
        if (periodStart) {
          assessmentsQuery = assessmentsQuery.gte('completed_at', periodStart);
        }
        if (periodEnd) {
          assessmentsQuery = assessmentsQuery.lte('completed_at', periodEnd);
        }

        const { data: assessments, error: assessmentsError } = await assessmentsQuery;
        if (assessmentsError) throw assessmentsError;

        // Buscar análises de risco psicossocial
        let riskQuery = supabase
          .from('psychosocial_risk_analysis')
          .select(`
            *,
            employees!inner(
              id, name, role_id, sector_id,
              roles(id, name),
              sectors(id, name)
            )
          `)
          .eq('company_id', companyId);

        if (periodStart) {
          riskQuery = riskQuery.gte('evaluation_date', periodStart);
        }
        if (periodEnd) {
          riskQuery = riskQuery.lte('evaluation_date', periodEnd);
        }

        const { data: riskAnalyses, error: riskError } = await riskQuery;
        if (riskError) throw riskError;

        // Buscar planos de ação
        let actionPlansQuery = supabase
          .from('action_plans')
          .select('*')
          .eq('company_id', companyId);

        if (periodStart) {
          actionPlansQuery = actionPlansQuery.gte('created_at', periodStart);
        }
        if (periodEnd) {
          actionPlansQuery = actionPlansQuery.lte('created_at', periodEnd);
        }

        const { data: actionPlans, error: actionPlansError } = await actionPlansQuery;
        if (actionPlansError) throw actionPlansError;

        // Aplicar filtros de setor e função
        const filteredAssessments = applyFilters(assessments || [], selectedSector, selectedRole);
        const filteredRiskAnalyses = applyFilters(riskAnalyses || [], selectedSector, selectedRole);

        // Calcular métricas FRPRT baseadas nos dados filtrados
        const frprtMetrics = calculateFRPRTMetrics(filteredAssessments, filteredRiskAnalyses);

        return {
          assessments: assessments || [],
          riskAnalyses: riskAnalyses || [],
          actionPlans: actionPlans || [],
          company,
          sectors: sectors || [],
          roles: roles || [],
          frprtMetrics,
          filteredData: {
            assessments: filteredAssessments,
            riskAnalyses: filteredRiskAnalyses
          }
        };
      } catch (error) {
        console.error("Erro ao buscar dados FRPRT:", error);
        throw error;
      }
    },
    enabled: !!companyId
  });

  return { frprtData, isLoading, error };
}

function applyFilters(data: any[], selectedSector?: string, selectedRole?: string) {
  return data.filter(item => {
    // Para assessment_responses, verificar employees.sector_id e employees.role_id
    // Para psychosocial_risk_analysis, verificar sector_id e role_id diretamente
    const sectorId = item.employees?.sector_id || item.sector_id;
    const roleId = item.employees?.role_id || item.role_id;

    const sectorMatch = !selectedSector || selectedSector === 'all-sectors' || sectorId === selectedSector;
    const roleMatch = !selectedRole || selectedRole === 'all-roles' || roleId === selectedRole;

    return sectorMatch && roleMatch;
  });
}

function calculateFRPRTMetrics(assessments: any[], riskAnalyses: any[]) {
  const totalAssessments = assessments.length;
  
  // Categorias FRPRT conforme NR-01
  const risksByCategory = {
    organizacao_trabalho: { low: 0, medium: 0, high: 0, critical: 0 },
    condicoes_psicossociais: { low: 0, medium: 0, high: 0, critical: 0 },
    relacoes_socioprofissionais: { low: 0, medium: 0, high: 0, critical: 0 },
    reconhecimento_crescimento: { low: 0, medium: 0, high: 0, critical: 0 },
    elo_trabalho_vida_social: { low: 0, medium: 0, high: 0, critical: 0 }
  };

  // Processar análises de risco por categoria
  riskAnalyses.forEach(risk => {
    const category = risk.category;
    const level = risk.exposure_level;
    
    if (risksByCategory[category]) {
      switch (level) {
        case 'baixo': 
          risksByCategory[category].low++; 
          break;
        case 'medio': 
          risksByCategory[category].medium++; 
          break;
        case 'alto': 
          risksByCategory[category].high++; 
          break;
        case 'critico': 
          risksByCategory[category].critical++; 
          break;
      }
    }
  });

  // Se não há análises de risco, criar estimativas baseadas nos scores das avaliações
  if (riskAnalyses.length === 0 && assessments.length > 0) {
    assessments.forEach(assessment => {
      const score = assessment.raw_score || 0;
      let level: 'low' | 'medium' | 'high' | 'critical';
      
      if (score >= 80) level = 'critical';
      else if (score >= 60) level = 'high';
      else if (score >= 40) level = 'medium';
      else level = 'low';

      // Distribuir entre as categorias (simulação)
      Object.keys(risksByCategory).forEach(category => {
        risksByCategory[category][level]++;
      });
    });
  }

  // Identificar categorias de alto risco
  const highRiskCategories = Object.entries(risksByCategory)
    .filter(([_, values]) => values.high > 0 || values.critical > 0)
    .map(([category]) => category);

  // Calcular nível geral de risco
  const overallRiskLevel = calculateOverallRisk(risksByCategory);

  return {
    totalAssessments,
    risksByCategory,
    highRiskCategories,
    overallRiskLevel
  };
}

function calculateOverallRisk(risksByCategory: any): string {
  let totalCritical = 0;
  let totalHigh = 0;
  
  Object.values(risksByCategory).forEach((category: any) => {
    totalCritical += category.critical;
    totalHigh += category.high;
  });

  if (totalCritical > 0) return 'Crítico';
  if (totalHigh > 2) return 'Alto';
  if (totalHigh > 0) return 'Médio';
  return 'Baixo';
}