import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export interface RiskAssessment {
  id: string;
  company_id: string;
  company_name?: string;
  employee_id?: string;
  employee_name?: string;
  sector_id?: string;
  sector_name?: string;
  role_id?: string;
  role_name?: string;
  assessment_response_id?: string;
  severity_index: number;
  probability_index: number;
  risk_value: number;
  risk_level: string;
  recommended_action?: string;
  risk_factors: string[];
  mitigation_actions: string[];
  status: 'identified' | 'in_progress' | 'mitigated' | 'accepted';
  next_assessment_date?: string;
  created_at: string;
  updated_at: string;
}

export function useRiskAssessments(companyId?: string) {
  const queryClient = useQueryClient();
  const { user, userCompanies } = useAuth();

  // Usar a primeira empresa do usuário se não especificada
  const targetCompanyId = companyId || (userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : null);

  const { data: riskAssessments, isLoading } = useQuery({
    queryKey: ['riskAssessments', targetCompanyId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_risk_assessments_by_company', {
        p_company_id: targetCompanyId
      });

      if (error) {
        console.error('Error fetching risk assessments:', error);
        throw error;
      }

      return (data || []) as RiskAssessment[];
    },
    enabled: !!targetCompanyId
  });

  const createRiskAssessment = useMutation({
    mutationFn: async (assessmentData: Partial<RiskAssessment>) => {
      const { data, error } = await supabase
        .from('risk_assessments')
        .insert({
          company_id: targetCompanyId,
          employee_id: assessmentData.employee_id,
          sector_id: assessmentData.sector_id,
          role_id: assessmentData.role_id,
          assessment_response_id: assessmentData.assessment_response_id,
          severity_index: assessmentData.severity_index,
          probability_index: assessmentData.probability_index,
          risk_value: assessmentData.risk_value,
          risk_level: assessmentData.risk_level,
          recommended_action: assessmentData.recommended_action,
          risk_factors: assessmentData.risk_factors || [],
          mitigation_actions: assessmentData.mitigation_actions || [],
          status: assessmentData.status || 'identified',
          next_assessment_date: assessmentData.next_assessment_date,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating risk assessment:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskAssessments'] });
      toast.success('Avaliação de risco criada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar avaliação de risco');
    }
  });

  const updateRiskAssessment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RiskAssessment> & { id: string }) => {
      const { data, error } = await supabase
        .from('risk_assessments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating risk assessment:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskAssessments'] });
      toast.success('Avaliação de risco atualizada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar avaliação de risco');
    }
  });

  const deleteRiskAssessment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('risk_assessments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting risk assessment:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskAssessments'] });
      toast.success('Avaliação de risco excluída com sucesso');
    },
    onError: () => {
      toast.error('Erro ao excluir avaliação de risco');
    }
  });

  return {
    riskAssessments: riskAssessments || [],
    isLoading,
    createRiskAssessment,
    updateRiskAssessment,
    deleteRiskAssessment,
  };
}
