/**
 * FASE 4: HOOK PARA RELATÓRIOS CONSOLIDADOS
 * RESPONSABILIDADE: Buscar dados completos da empresa para relatórios
 * 
 * FUNCIONALIDADES:
 * - Dashboard empresa inteira
 * - Estatísticas consolidadas por setor
 * - Dados para geração de PDF
 * - Métricas de risco e compliance
 * 
 * INTEGRAÇÃO:
 * - Usa dados unificados das Fases 1-3
 * - Compatible com geração de PDF
 * - Integra com sistema de critérios unificados
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateRiskLevel } from "@/utils/riskCriteriaUnified";

export interface ConsolidatedReportData {
  companyInfo: {
    id: string;
    name: string;
    cnpj: string;
    contact_name?: string;
    contact_email?: string;
    city?: string;
    state?: string;
  };
  totalStats: {
    totalEmployees: number;
    totalAssessments: number;
    completedAssessments: number;
    pendingAssessments: number;
    assessmentCoverage: number; // percentage
  };
  riskDistribution: {
    baixo: number;
    medio: number;
    alto: number;
    critico: number;
  };
  sectorAnalysis: Array<{
    sectorId: string;
    sectorName: string;
    totalEmployees: number;
    assessments: number;
    coverage: number;
    riskBreakdown: {
      baixo: number;
      medio: number;
      alto: number;
      critico: number;
    };
    averageScore: number;
    riskLevel: string;
  }>;
  roleAnalysis: Array<{
    roleId: string;
    roleName: string;
    totalEmployees: number;
    assessments: number;
    coverage: number;
    riskBreakdown: {
      baixo: number;
      medio: number;
      alto: number;
      critico: number;
    };
    averageScore: number;
    riskLevel: string;
  }>;
  actionPlansStatus: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
  };
  complianceMetrics: {
    lastAssessmentDate: string | null;
    nextAssessmentDue: string | null;
    complianceStatus: 'compliant' | 'attention' | 'critical';
    daysUntilDue: number;
  };
}

export function useConsolidatedReports(companyId: string | null) {
  return useQuery({
    queryKey: ['consolidated-reports', companyId],
    queryFn: async (): Promise<ConsolidatedReportData> => {
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      console.log('🔍 [FASE 4] Buscando dados consolidados para empresa:', companyId);

      // 1. Buscar informações da empresa
      const { data: companyInfo, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (companyError) throw companyError;

      // 2. Buscar total de funcionários
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, sector_id, role_id, sectors(id, name), roles(id, name)')
        .eq('company_id', companyId)
        .eq('status', 'active')
        .eq('employee_type', 'funcionario');

      if (employeesError) throw employeesError;

      // 3. Buscar avaliações concluídas
      const { data: assessments, error: assessmentsError } = await supabase
        .from('assessment_responses')
        .select(`
          id,
          employee_id,
          raw_score,
          completed_at,
          employees!inner(sector_id, role_id, sectors(name), roles(name))
        `)
        .eq('employees.company_id', companyId)
        .not('completed_at', 'is', null);

      if (assessmentsError) throw assessmentsError;

      // 4. Buscar planos de ação
      const { data: actionPlans, error: plansError } = await supabase
        .from('action_plans')
        .select('id, status, due_date, completion_date')
        .eq('company_id', companyId);

      if (plansError) throw plansError;

      // 5. Processar dados
      const totalEmployees = employees?.length || 0;
      const totalAssessments = assessments?.length || 0;
      const assessmentCoverage = totalEmployees > 0 ? (totalAssessments / totalEmployees) * 100 : 0;

      // 6. Calcular distribuição de risco
      const riskDistribution = { baixo: 0, medio: 0, alto: 0, critico: 0 };
      
      assessments?.forEach(assessment => {
        const score = assessment.raw_score || 0;
        const riskLevel = calculateRiskLevel(score);
        
        switch (riskLevel) {
          case 'Baixo':
            riskDistribution.baixo++;
            break;
          case 'Médio':
            riskDistribution.medio++;
            break;
          case 'Alto':
            riskDistribution.alto++;
            break;
          case 'Crítico':
            riskDistribution.critico++;
            break;
        }
      });

      // 7. Análise por setor
      const sectorMap = new Map();
      employees?.forEach(emp => {
        if (emp.sectors) {
          const sectorId = emp.sector_id;
          if (!sectorMap.has(sectorId)) {
            sectorMap.set(sectorId, {
              sectorId,
              sectorName: emp.sectors.name,
              totalEmployees: 0,
              assessments: 0,
              scores: []
            });
          }
          const sector = sectorMap.get(sectorId);
          sector.totalEmployees++;
        }
      });

      assessments?.forEach(assessment => {
        const sectorId = assessment.employees?.sector_id;
        if (sectorId && sectorMap.has(sectorId)) {
          const sector = sectorMap.get(sectorId);
          sector.assessments++;
          sector.scores.push(assessment.raw_score || 0);
        }
      });

      const sectorAnalysis = Array.from(sectorMap.values()).map(sector => {
        const coverage = sector.totalEmployees > 0 ? (sector.assessments / sector.totalEmployees) * 100 : 0;
        const averageScore = sector.scores.length > 0 
          ? sector.scores.reduce((a: number, b: number) => a + b, 0) / sector.scores.length 
          : 0;

        const riskBreakdown = { baixo: 0, medio: 0, alto: 0, critico: 0 };
        sector.scores.forEach((score: number) => {
          const riskLevel = calculateRiskLevel(score).toLowerCase();
          riskBreakdown[riskLevel as keyof typeof riskBreakdown]++;
        });

        // Se não há avaliações, classificar como "não avaliado"
        const riskLevel = sector.assessments === 0 ? 'não avaliado' : calculateRiskLevel(averageScore).toLowerCase();

        return {
          ...sector,
          coverage,
          averageScore,
          riskLevel,
          riskBreakdown
        };
      });

      // 8. Análise por função (similar ao setor)
      const roleMap = new Map();
      employees?.forEach(emp => {
        if (emp.roles) {
          const roleId = emp.role_id;
          if (!roleMap.has(roleId)) {
            roleMap.set(roleId, {
              roleId,
              roleName: emp.roles.name,
              totalEmployees: 0,
              assessments: 0,
              scores: []
            });
          }
          const role = roleMap.get(roleId);
          role.totalEmployees++;
        }
      });

      assessments?.forEach(assessment => {
        const roleId = assessment.employees?.role_id;
        if (roleId && roleMap.has(roleId)) {
          const role = roleMap.get(roleId);
          role.assessments++;
          role.scores.push(assessment.raw_score || 0);
        }
      });

      const roleAnalysis = Array.from(roleMap.values()).map(role => {
        const coverage = role.totalEmployees > 0 ? (role.assessments / role.totalEmployees) * 100 : 0;
        const averageScore = role.scores.length > 0 
          ? role.scores.reduce((a: number, b: number) => a + b, 0) / role.scores.length 
          : 0;

        const riskBreakdown = { baixo: 0, medio: 0, alto: 0, critico: 0 };
        role.scores.forEach((score: number) => {
          const riskLevel = calculateRiskLevel(score).toLowerCase();
          riskBreakdown[riskLevel as keyof typeof riskBreakdown]++;
        });

        // Se não há avaliações, classificar como "não avaliado"
        const riskLevel = role.assessments === 0 ? 'não avaliado' : calculateRiskLevel(averageScore).toLowerCase();

        return {
          ...role,
          coverage,
          averageScore,
          riskLevel,
          riskBreakdown
        };
      });

      // 9. Status dos planos de ação
      const actionPlansStatus = {
        total: actionPlans?.length || 0,
        completed: actionPlans?.filter(p => p.status === 'completed').length || 0,
        inProgress: actionPlans?.filter(p => p.status === 'in_progress').length || 0,
        overdue: actionPlans?.filter(p => 
          p.due_date && new Date(p.due_date) < new Date() && p.status !== 'completed'
        ).length || 0,
        completionRate: 0
      };
      
      actionPlansStatus.completionRate = actionPlansStatus.total > 0 
        ? (actionPlansStatus.completed / actionPlansStatus.total) * 100 
        : 0;

      // 10. Métricas de compliance
      const lastAssessment = assessments?.sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      )[0];

      const lastAssessmentDate = lastAssessment?.completed_at || null;
      const nextAssessmentDue = lastAssessmentDate 
        ? new Date(new Date(lastAssessmentDate).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : null;
      
      const daysUntilDue = nextAssessmentDue 
        ? Math.ceil((new Date(nextAssessmentDue).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))
        : 365;

      const complianceStatus = daysUntilDue <= 30 ? 'critical' : daysUntilDue <= 90 ? 'attention' : 'compliant';

      const result: ConsolidatedReportData = {
        companyInfo,
        totalStats: {
          totalEmployees,
          totalAssessments,
          completedAssessments: totalAssessments,
          pendingAssessments: totalEmployees - totalAssessments,
          assessmentCoverage
        },
        riskDistribution,
        sectorAnalysis,
        roleAnalysis,
        actionPlansStatus,
        complianceMetrics: {
          lastAssessmentDate,
          nextAssessmentDue,
          complianceStatus,
          daysUntilDue
        }
      };

      console.log('📊 [FASE 4] Dados consolidados processados:', {
        totalEmployees,
        totalAssessments,
        coverage: assessmentCoverage.toFixed(1) + '%',
        sectorsAnalyzed: sectorAnalysis.length,
        rolesAnalyzed: roleAnalysis.length
      });

      return result;
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}