
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
  const { userCompanies } = useAuth();

  const targetCompanyId = companyId || (userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : null);

  // Buscar critérios psicossociais
  const { data: criteria, isLoading: criteriaLoading } = useQuery({
    queryKey: ['psychosocialCriteria', targetCompanyId],
    queryFn: async () => {
      let query = supabase
        .from('psychosocial_criteria')
        .select('*')
        .eq('is_active', true);

      if (targetCompanyId) {
        query = query.or(`company_id.eq.${targetCompanyId},company_id.is.null`);
      } else {
        query = query.is('company_id', null);
      }

      const { data, error } = await query.order('category', { ascending: true });

      if (error) {
        console.error('Error fetching psychosocial criteria:', error);
        throw error;
      }

      return (data || []) as PsychosocialCriteria[];
    },
    enabled: !!targetCompanyId
  });

  // Buscar análises de risco psicossocial
  const { data: riskAnalyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['psychosocialRiskAnalyses', targetCompanyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('psychosocial_risk_analysis')
        .select(`
          *,
          sectors(id, name),
          roles(id, name)
        `)
        .eq('company_id', targetCompanyId!)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching psychosocial risk analyses:', error);
        throw error;
      }

      return (data || []) as PsychosocialRiskAnalysis[];
    },
    enabled: !!targetCompanyId
  });

  // Buscar templates de ação NR-01
  const { data: actionTemplates, isLoading: templatesLoading } = useQuery({
    queryKey: ['nr01ActionTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nr01_action_templates')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching NR-01 action templates:', error);
        throw error;
      }

      return (data || []) as NR01ActionTemplate[];
    }
  });

  // Calcular risco psicossocial
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

  // Gerar plano de ação NR-01
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

  // Criar análise de risco manual
  const createRiskAnalysis = useMutation({
    mutationFn: async (analysisData: Partial<PsychosocialRiskAnalysis>) => {
      const { data, error } = await supabase
        .from('psychosocial_risk_analysis')
        .insert({
          company_id: targetCompanyId!,
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

  return {
    criteria: criteria || [],
    riskAnalyses: riskAnalyses || [],
    actionTemplates: actionTemplates || [],
    isLoading: criteriaLoading || analysesLoading || templatesLoading,
    calculatePsychosocialRisk,
    generateNR01ActionPlan,
    createRiskAnalysis
  };
}
