
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface NR01ActionPlan {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  risk_level?: 'baixo' | 'medio' | 'alto' | 'critico';
  sector_name?: string;
  sector_id?: string;
  responsible_user_id?: string;
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  progress_percentage: number;
  budget_allocated?: number;
  budget_used?: number;
  created_at: string;
  updated_at: string;
  // Dados da análise de risco relacionada
  risk_analysis?: {
    id: string;
    category: string;
    exposure_level: string;
    risk_score: number;
    evaluation_date: string;
  };
}

interface UseNR01ActionPlansProps {
  riskLevel?: string;
  sector?: string;
  status?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export function useNR01ActionPlans(filters: UseNR01ActionPlansProps = {}) {
  const { userCompanies } = useAuth();
  const companyId = userCompanies.length > 0 ? userCompanies[0].companyId : null;

  const { data: actionPlans, isLoading, error } = useQuery({
    queryKey: ['nr01-action-plans', companyId, filters],
    queryFn: async (): Promise<NR01ActionPlan[]> => {
      if (!companyId) return [];

      // Buscar planos de ação com join nas análises de risco psicossocial
      let query = supabase
        .from('action_plans')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          risk_level,
          sector_id,
          sectors!inner(name),
          responsible_user_id,
          start_date,
          due_date,
          completion_date,
          progress_percentage,
          budget_allocated,
          budget_used,
          created_at,
          updated_at,
          psychosocial_risk_analysis!left(
            id,
            category,
            exposure_level,
            risk_score,
            evaluation_date
          )
        `)
        .eq('company_id', companyId);

      // Aplicar filtros
      if (filters.riskLevel && filters.riskLevel !== 'all') {
        query = query.eq('risk_level', filters.riskLevel);
      }

      if (filters.sector && filters.sector !== 'all') {
        query = query.eq('sector_id', filters.sector);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.dateRange?.from) {
        query = query.gte('created_at', filters.dateRange.from.toISOString());
      }

      if (filters.dateRange?.to) {
        query = query.lte('created_at', filters.dateRange.to.toISOString());
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching NR-01 action plans:', error);
        throw error;
      }

      // Transformar dados para o formato esperado
      return (data || []).map(plan => ({
        id: plan.id,
        title: plan.title,
        description: plan.description,
        status: plan.status as any,
        priority: plan.priority as any,
        risk_level: plan.risk_level as any,
        sector_name: plan.sectors?.name,
        sector_id: plan.sector_id,
        responsible_user_id: plan.responsible_user_id,
        start_date: plan.start_date,
        due_date: plan.due_date,
        completion_date: plan.completion_date,
        progress_percentage: plan.progress_percentage,
        budget_allocated: plan.budget_allocated,
        budget_used: plan.budget_used,
        created_at: plan.created_at,
        updated_at: plan.updated_at,
        risk_analysis: plan.psychosocial_risk_analysis ? {
          id: plan.psychosocial_risk_analysis.id,
          category: plan.psychosocial_risk_analysis.category,
          exposure_level: plan.psychosocial_risk_analysis.exposure_level,
          risk_score: plan.psychosocial_risk_analysis.risk_score,
          evaluation_date: plan.psychosocial_risk_analysis.evaluation_date
        } : undefined
      }));
    },
    enabled: !!companyId
  });

  return {
    actionPlans: actionPlans || [],
    isLoading,
    error
  };
}
