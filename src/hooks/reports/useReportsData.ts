
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ReportData {
  totalAssessments: number;
  completedAssessments: number;
  pendingAssessments: number;
  highRiskEmployees: number;
  mediumRiskEmployees: number;
  lowRiskEmployees: number;
  assessmentsByMonth: Array<{
    month: string;
    count: number;
  }>;
  riskByRole: Array<{
    role: string;
    high: number;
    medium: number;
    low: number;
  }>;
  riskBySector: Array<{
    sector: string;
    high: number;
    medium: number;
    low: number;
  }>;
  sectors: Array<{
    id: string;
    name: string;
  }>;
  roles: Array<{
    id: string;
    name: string;
  }>;
}

export function useReportsData(companyId?: string) {
  const { userRole } = useAuth();

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['reportsData', companyId],
    queryFn: async (): Promise<ReportData> => {
      try {
        // Buscar setores reais
        let sectorsQuery = supabase.from('sectors').select('id, name');
        if (companyId && userRole !== 'superadmin') {
          sectorsQuery = sectorsQuery.eq('company_id', companyId);
        }
        const { data: sectors } = await sectorsQuery;

        // Buscar funções reais
        let rolesQuery = supabase.from('roles').select('id, name');
        if (companyId && userRole !== 'superadmin') {
          rolesQuery = rolesQuery.eq('company_id', companyId);
        }
        const { data: roles } = await rolesQuery;

        // Buscar avaliações
        let assessmentsQuery = supabase
          .from('assessment_responses')
          .select(`
            *,
            employees!inner(
              id, name, company_id, role_id, sector_id,
              roles(name),
              sectors(name)
            )
          `);

        if (companyId && userRole !== 'superadmin') {
          assessmentsQuery = assessmentsQuery.eq('employees.company_id', companyId);
        }

        const { data: assessments, error: assessmentsError } = await assessmentsQuery;
        if (assessmentsError) throw assessmentsError;

        // Calcular métricas
        const totalAssessments = assessments?.length || 0;
        const completedAssessments = assessments?.filter(a => a.completed_at).length || 0;
        const pendingAssessments = totalAssessments - completedAssessments;

        // Categorizar por risco baseado no raw_score (escala 0-100)
        const highRiskEmployees = assessments?.filter(a => a.raw_score && a.raw_score >= 60).length || 0;
        const mediumRiskEmployees = assessments?.filter(a => a.raw_score && a.raw_score >= 30 && a.raw_score < 60).length || 0;
        const lowRiskEmployees = assessments?.filter(a => a.raw_score && a.raw_score < 30).length || 0;

        // Avaliações por mês
        const assessmentsByMonth = getAssessmentsByMonth(assessments || []);

        // Risco por função
        const riskByRole = getRiskByRole(assessments || []);

        // Risco por setor
        const riskBySector = getRiskBySector(assessments || []);

        return {
          totalAssessments,
          completedAssessments,
          pendingAssessments,
          highRiskEmployees,
          mediumRiskEmployees,
          lowRiskEmployees,
          assessmentsByMonth,
          riskByRole,
          riskBySector,
          sectors: sectors || [],
          roles: roles || [],
        };
      } catch (error) {
        console.error("Erro ao buscar dados dos relatórios:", error);
        // Retornar dados vazios em caso de erro
        return {
          totalAssessments: 0,
          completedAssessments: 0,
          pendingAssessments: 0,
          highRiskEmployees: 0,
          mediumRiskEmployees: 0,
          lowRiskEmployees: 0,
          assessmentsByMonth: [],
          riskByRole: [],
          riskBySector: [],
          sectors: [],
          roles: [],
        };
      }
    }
  });

  return { reportsData, isLoading };
}

function getAssessmentsByMonth(assessments: any[]) {
  const monthCounts: Record<string, number> = {};
  
  assessments.forEach(assessment => {
    if (assessment.completed_at) {
      const date = new Date(assessment.completed_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    }
  });

  return Object.entries(monthCounts).map(([month, count]) => ({
    month,
    count
  })).sort((a, b) => a.month.localeCompare(b.month));
}

function getRiskByRole(assessments: any[]) {
  const roleRisks: Record<string, { high: number; medium: number; low: number }> = {};

  assessments.forEach(assessment => {
    // Handle employees as either array or single object
    const employees = Array.isArray(assessment.employees) ? assessment.employees[0] : assessment.employees;
    
    if (employees?.roles?.name && assessment.raw_score !== null) {
      const roleName = employees.roles.name;
      if (!roleRisks[roleName]) {
        roleRisks[roleName] = { high: 0, medium: 0, low: 0 };
      }

      if (assessment.raw_score >= 60) {
        roleRisks[roleName].high++;
      } else if (assessment.raw_score >= 30) {
        roleRisks[roleName].medium++;
      } else {
        roleRisks[roleName].low++;
      }
    }
  });

  return Object.entries(roleRisks).map(([role, risks]) => ({
    role,
    ...risks
  }));
}

function getRiskBySector(assessments: any[]) {
  const sectorRisks: Record<string, { high: number; medium: number; low: number }> = {};

  assessments.forEach(assessment => {
    // Handle employees as either array or single object
    const employees = Array.isArray(assessment.employees) ? assessment.employees[0] : assessment.employees;
    
    if (employees?.sectors?.name && assessment.raw_score !== null) {
      const sectorName = employees.sectors.name;
      if (!sectorRisks[sectorName]) {
        sectorRisks[sectorName] = { high: 0, medium: 0, low: 0 };
      }

      if (assessment.raw_score >= 60) {
        sectorRisks[sectorName].high++;
      } else if (assessment.raw_score >= 30) {
        sectorRisks[sectorName].medium++;
      } else {
        sectorRisks[sectorName].low++;
      }
    }
  });

  return Object.entries(sectorRisks).map(([sector, risks]) => ({
    sector,
    ...risks
  }));
}
