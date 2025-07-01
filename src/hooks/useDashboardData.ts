
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

export interface DashboardMetrics {
  totalEmployees: number;
  pendingAssessments: number;
  completedAssessments: number;
  highRiskEmployees: number;
  criticalRiskEmployees: number;
  upcomingReassessments: number;
}

export interface RecentAssessment {
  id: string;
  employeeName: string;
  employeeId: string;
  sector: string;
  completedAt: string;
  riskLevel: 'Alto' | 'Médio' | 'Baixo';
  dominantFactor?: string;
}

export function useDashboardData(companyId: string | null) {
  const { userRole } = useAuth();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics', companyId],
    queryFn: async (): Promise<DashboardMetrics> => {
      if (!companyId && userRole !== 'superadmin') {
        return {
          totalEmployees: 0,
          pendingAssessments: 0,
          completedAssessments: 0,
          highRiskEmployees: 0,
          criticalRiskEmployees: 0,
          upcomingReassessments: 0
        };
      }

      // Total de funcionários
      let employeesQuery = supabase.from('employees').select('id', { count: 'exact' });
      if (companyId) {
        employeesQuery = employeesQuery.eq('company_id', companyId);
      }
      const { count: totalEmployees } = await employeesQuery;

      // Avaliações pendentes usando completed_at
      let pendingQuery = supabase
        .from('scheduled_assessments')
        .select('id', { count: 'exact' })
        .in('status', ['scheduled', 'sent'])
        .is('completed_at', null);
      
      if (companyId) {
        pendingQuery = pendingQuery.eq('company_id', companyId);
      }
      const { count: pendingAssessments } = await pendingQuery;

      // Avaliações completadas usando completed_at diretamente
      let completedQuery = supabase
        .from('assessment_responses')
        .select('id', { count: 'exact' })
        .not('completed_at', 'is', null);

      if (companyId) {
        const { data: companyEmployees } = await supabase
          .from('employees')
          .select('id')
          .eq('company_id', companyId);
        
        if (companyEmployees && companyEmployees.length > 0) {
          const employeeIds = companyEmployees.map(emp => emp.id);
          completedQuery = completedQuery.in('employee_id', employeeIds);
        }
      }
      const { count: completedAssessments } = await completedQuery;

      // Usar risk_level diretamente da tabela assessment_responses
      let highRiskQuery = supabase
        .from('assessment_responses')
        .select('id', { count: 'exact' })
        .eq('risk_level', 'Alto')
        .not('completed_at', 'is', null);

      let criticalRiskQuery = supabase
        .from('assessment_responses')
        .select('id', { count: 'exact' })
        .eq('risk_level', 'Crítico')
        .not('completed_at', 'is', null);

      if (companyId) {
        const { data: companyEmployees } = await supabase
          .from('employees')
          .select('id')
          .eq('company_id', companyId);
        
        if (companyEmployees && companyEmployees.length > 0) {
          const employeeIds = companyEmployees.map(emp => emp.id);
          highRiskQuery = highRiskQuery.in('employee_id', employeeIds);
          criticalRiskQuery = criticalRiskQuery.in('employee_id', employeeIds);
        }
      }

      const { count: highRiskEmployees } = await highRiskQuery;
      const { count: criticalRiskEmployees } = await criticalRiskQuery;

      // Próximas reavaliações (próximos 30 dias)
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      
      let upcomingQuery = supabase
        .from('scheduled_assessments')
        .select('id', { count: 'exact' })
        .eq('status', 'scheduled')
        .lte('scheduled_date', nextMonth.toISOString())
        .gte('scheduled_date', new Date().toISOString());

      if (companyId) {
        upcomingQuery = upcomingQuery.eq('company_id', companyId);
      }
      const { count: upcomingReassessments } = await upcomingQuery;

      return {
        totalEmployees: totalEmployees || 0,
        pendingAssessments: pendingAssessments || 0,
        completedAssessments: completedAssessments || 0,
        highRiskEmployees: highRiskEmployees || 0,
        criticalRiskEmployees: criticalRiskEmployees || 0,
        upcomingReassessments: upcomingReassessments || 0
      };
    },
    enabled: userRole === 'superadmin' || !!companyId,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const { data: recentAssessments, isLoading: assessmentsLoading } = useQuery({
    queryKey: ['recent-assessments', companyId],
    queryFn: async (): Promise<RecentAssessment[]> => {
      if (!companyId && userRole !== 'superadmin') {
        return [];
      }

      let query = supabase
        .from('assessment_responses')
        .select(`
          id,
          employee_name,
          employee_id,
          completed_at,
          dominant_factor,
          risk_level,
          employees!inner(
            id,
            name,
            sectors(name)
          )
        `)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (companyId) {
        query = query.eq('employees.company_id', companyId);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      return (data || []).map(assessment => {
        // Usar o risk_level diretamente da tabela, com fallback para cálculo manual apenas se necessário
        let riskLevel: 'Alto' | 'Médio' | 'Baixo' = 'Baixo';
        
        if (assessment.risk_level) {
          // Mapear possíveis valores do banco para o formato esperado
          const dbRiskLevel = assessment.risk_level.toLowerCase();
          if (dbRiskLevel === 'alto' || dbRiskLevel === 'crítico' || dbRiskLevel === 'critical') {
            riskLevel = 'Alto';
          } else if (dbRiskLevel === 'médio' || dbRiskLevel === 'medio' || dbRiskLevel === 'medium') {
            riskLevel = 'Médio';
          } else {
            riskLevel = 'Baixo';
          }
        }

        // Handle employee data properly
        const employeesArray = Array.isArray(assessment.employees) ? assessment.employees : (assessment.employees ? [assessment.employees] : []);
        const employee = employeesArray[0];
        const employeeName = assessment.employee_name || (employee?.name) || 'Anônimo';
        const sector = employee?.sectors?.name || 'N/A';

        return {
          id: assessment.id,
          employeeName,
          employeeId: assessment.employee_id || '',
          sector,
          completedAt: assessment.completed_at,
          riskLevel,
          dominantFactor: assessment.dominant_factor
        };
      });
    },
    enabled: userRole === 'superadmin' || !!companyId,
  });

  return {
    metrics,
    recentAssessments: recentAssessments || [],
    isLoading: metricsLoading || assessmentsLoading
  };
}
