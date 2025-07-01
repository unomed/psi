import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export interface PsychosocialCriteria {
  id: string;
  company_id?: string;
  category: 'organizacao_trabalho' | 'condicoes_ambientais' | 'relacoes_socioprofissionais' | 'reconhecimento_crescimento' | 'elo_trabalho_vida_social';
  factor_name: string;
  description?: string;
  weight: number;
  threshold_low: number;
  threshold_medium: number;
  threshold_high: number;
  mandatory_actions: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PsychosocialRiskAnalysis {
  id: string;
  company_id: string;
  sector_id?: string;
  role_id?: string;
  assessment_response_id?: string;
  category: string;
  exposure_level: 'baixo' | 'medio' | 'alto' | 'critico';
  risk_score: number;
  contributing_factors: string[];
  recommended_actions: string[];
  mandatory_measures: string[];
  evaluation_date: string;
  next_evaluation_date?: string;
  status: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface NR01ActionTemplate {
  id: string;
  category: string;
  exposure_level: string;
  template_name: string;
  description?: string;
  mandatory_actions: string[];
  recommended_timeline_days: number;
  responsible_roles: string[];
  legal_requirements?: string;
  is_mandatory: boolean;
  created_at: string;
  updated_at: string;
}

export function usePsychosocialRisk(companyId?: string) {
  const queryClient = useQueryClient();
  const { userCompanies, userRole, isAuthenticated } = useAuth();

  // Melhor lógica para determinar targetCompanyId com logs de debug
  const targetCompanyId = (() => {
    console.log('[usePsychosocialRisk] Debug company resolution:', {
      companyIdParam: companyId,
      userCompanies: userCompanies,
      userRole: userRole,
      isAuthenticated: isAuthenticated
    });

    if (companyId) {
      console.log('[usePsychosocialRisk] Using companyId from parameter:', companyId);
      return companyId;
    }

    if (userRole === 'superadmin') {
      console.log('[usePsychosocialRisk] Superadmin - will query all companies');
      return null; // Superadmin pode ver todos
    }

    if (userCompanies && userCompanies.length > 0) {
      const firstCompanyId = userCompanies[0].companyId;
      console.log('[usePsychosocialRisk] Using first company from userCompanies:', firstCompanyId);
      return firstCompanyId;
    }

    console.warn('[usePsychosocialRisk] No company ID available - queries will be disabled');
    return null;
  })();

  // Buscar critérios psicossociais com retry e melhor error handling
  const { data: criteria, isLoading: criteriaLoading, error: criteriaError } = useQuery({
    queryKey: ['psychosocialCriteria', targetCompanyId],
    queryFn: async () => {
      console.log('[usePsychosocialRisk] Fetching psychosocial criteria for company:', targetCompanyId);
      
      let query = supabase
        .from('psychosocial_criteria')
        .select('*')
        .eq('is_active', true);

      if (targetCompanyId) {
        query = query.or(`company_id.eq.${targetCompanyId},company_id.is.null`);
      } else if (userRole !== 'superadmin') {
        query = query.is('company_id', null);
      }

      const { data, error } = await query.order('category', { ascending: true });

      if (error) {
        console.error('[usePsychosocialRisk] Error fetching psychosocial criteria:', error);
        throw error;
      }

      console.log('[usePsychosocialRisk] Successfully fetched criteria:', data?.length || 0, 'records');
      return (data || []) as PsychosocialCriteria[];
    },
    enabled: isAuthenticated && (userRole === 'superadmin' || !!targetCompanyId),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2,
    retryDelay: 1000
  });

  // Buscar análises de risco psicossocial com melhor logging
  const { data: riskAnalyses, isLoading: analysesLoading, error: analysesError } = useQuery({
    queryKey: ['psychosocialRiskAnalyses', targetCompanyId],
    queryFn: async () => {
      console.log('[usePsychosocialRisk] Fetching risk analyses for company:', targetCompanyId);
      
      if (!targetCompanyId && userRole !== 'superadmin') {
        console.log('[usePsychosocialRisk] No company ID and not superadmin - returning empty array');
        return [];
      }

      let query = supabase
        .from('psychosocial_risk_analysis')
        .select(`
          *,
          sectors(id, name),
          roles(id, name)
        `);

      if (targetCompanyId) {
        query = query.eq('company_id', targetCompanyId);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('[usePsychosocialRisk] Error fetching psychosocial risk analyses:', error);
        throw error;
      }

      console.log('[usePsychosocialRisk] Successfully fetched risk analyses:', data?.length || 0, 'records');
      console.log('[usePsychosocialRisk] Categories found:', [...new Set(data?.map(d => d.category) || [])]);
      
      return (data || []) as PsychosocialRiskAnalysis[];
    },
    enabled: isAuthenticated && (userRole === 'superadmin' || !!targetCompanyId),
    staleTime: 2 * 60 * 1000, // 2 minutes cache for more dynamic data
    retry: 2,
    retryDelay: 1000
  });

  // Buscar templates de ação NR-01
  const { data: actionTemplates, isLoading: templatesLoading, error: templatesError } = useQuery({
    queryKey: ['nr01ActionTemplates'],
    queryFn: async () => {
      console.log('[usePsychosocialRisk] Fetching NR-01 action templates');
      
      const { data, error } = await supabase
        .from('nr01_action_templates')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('[usePsychosocialRisk] Error fetching NR-01 action templates:', error);
        throw error;
      }

      console.log('[usePsychosocialRisk] Successfully fetched action templates:', data?.length || 0, 'records');
      return (data || []) as NR01ActionTemplate[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache for relatively static data
    retry: 1
  });

  const calculatePsychosocialRisk = useMutation({
    mutationFn: async ({ assessmentResponseId, companyId }: { assessmentResponseId: string; companyId: string }) => {
      const { data, error } = await supabase.rpc('calculate_psychosocial_risk', {
        p_assessment_response_id: assessmentResponseId,
        p_company_id: companyId
      });

      if (error) {
        console.error('Error calculating psychosocial risk:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychosocialRiskAnalyses'] });
      toast.success('Análise de risco psicossocial calculada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao calcular análise de risco psicossocial');
    }
  });

  const generateNR01ActionPlan = useMutation({
    mutationFn: async (riskAnalysisId: string) => {
      const { data, error } = await supabase.rpc('generate_nr01_action_plan', {
        p_risk_analysis_id: riskAnalysisId
      });

      if (error) {
        console.error('Error generating NR-01 action plan:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionPlans'] });
      toast.success('Plano de ação NR-01 gerado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao gerar plano de ação NR-01');
    }
  });

  const createRiskAnalysis = useMutation({
    mutationFn: async (analysisData: Partial<PsychosocialRiskAnalysis>) => {
      if (!targetCompanyId) {
        throw new Error('Company ID is required to create risk analysis');
      }

      const { data, error } = await supabase
        .from('psychosocial_risk_analysis')
        .insert({
          company_id: targetCompanyId,
          sector_id: analysisData.sector_id,
          role_id: analysisData.role_id,
          assessment_response_id: analysisData.assessment_response_id,
          category: analysisData.category as 'organizacao_trabalho' | 'condicoes_ambientais' | 'relacoes_socioprofissionais' | 'reconhecimento_crescimento' | 'elo_trabalho_vida_social',
          exposure_level: analysisData.exposure_level as 'baixo' | 'medio' | 'alto' | 'critico',
          risk_score: analysisData.risk_score!,
          contributing_factors: analysisData.contributing_factors || [],
          recommended_actions: analysisData.recommended_actions || [],
          mandatory_measures: analysisData.mandatory_measures || [],
          evaluation_date: analysisData.evaluation_date || new Date().toISOString().split('T')[0],
          next_evaluation_date: analysisData.next_evaluation_date,
          status: analysisData.status || 'identified'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating risk analysis:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychosocialRiskAnalyses'] });
      toast.success('Análise de risco criada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar análise de risco');
    }
  });

  // Combine all errors with better logging
  const error = criteriaError || analysesError || templatesError;
  
  if (error) {
    console.error('[usePsychosocialRisk] Combined error state:', {
      criteriaError: criteriaError?.message,
      analysesError: analysesError?.message,
      templatesError: templatesError?.message
    });
  }

  const isLoading = criteriaLoading || analysesLoading || templatesLoading;
  
  console.log('[usePsychosocialRisk] Hook state:', {
    targetCompanyId,
    isLoading,
    hasError: !!error,
    criteriaCount: criteria?.length || 0,
    analysesCount: riskAnalyses?.length || 0,
    templatesCount: actionTemplates?.length || 0
  });

  return {
    criteria: criteria || [],
    riskAnalyses: riskAnalyses || [],
    actionTemplates: actionTemplates || [],
    isLoading,
    error,
    targetCompanyId, // Expor para debug
    calculatePsychosocialRisk,
    generateNR01ActionPlan,
    createRiskAnalysis
  };
}
