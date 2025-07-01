
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

      // Avaliações pendentes
      let pendingQuery = supabase
        .from('scheduled_assessments')
        .select('id', { count: 'exact' })
        .in('status', ['scheduled', 'sent']);
      
      if (companyId) {
        pendingQuery = pendingQuery.eq('company_id', companyId);
      }
      const { count: pendingAssessments } = await pendingQuery;

      // Avaliações completadas
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

      // Funcionários em alto risco
      let highRiskQuery = supabase
        .from('psychosocial_risk_analysis')
        .select('id', { count: 'exact' })
        .eq('exposure_level', 'alto');

      if (companyId) {
        highRiskQuery = highRiskQuery.eq('company_id', companyId);
      }
      const { count: highRiskEmployees } = await highRiskQuery;

      // Funcionários em risco crítico
      let criticalRiskQuery = supabase
        .from('psychosocial_risk_analysis')
        .select('id', { count: 'exact' })
        .eq('exposure_level', 'critico');

      if (companyId) {
        criticalRiskQuery = criticalRiskQuery.eq('company_id', companyId);
      }
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
          factors_scores,
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
        // Calculate risk level based on assessment data
        let riskLevel: 'Alto' | 'Médio' | 'Baixo' = 'Baixo';
        
        if (assessment.factors_scores) {
          const scores = Object.values(assessment.factors_scores as Record<string, number>);
          const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          
          if (avgScore >= 0.7) riskLevel = 'Alto';
          else if (avgScore >= 0.4) riskLevel = 'Médio';
        }

        // Handle employee data properly - it can be an array from Supabase
        const employeesArray = Array.isArray(assessment.employees) ? assessment.employees : (assessment.employees ? [assessment.employees] : []);
        const employee = employeesArray[0]; // Get first employee from array
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
