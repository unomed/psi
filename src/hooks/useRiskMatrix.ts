import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export interface RiskMatrixConfig {
  id: string;
  company_id?: string;
  matrix_size: number;
  row_labels: string[];
  col_labels: string[];
  risk_matrix: number[][];
  risk_actions: Array<{
    level: string;
    action: string;
    color: string;
  }>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RiskCalculation {
  risk_value: number;
  risk_level: string;
  recommended_action: string;
  risk_color: string;
}

export function useRiskMatrix(companyId?: string) {
  const queryClient = useQueryClient();
  const { userCompanies } = useAuth();

  // Usar a primeira empresa do usuário se não especificada
  const targetCompanyId = companyId || (userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : null);

  const { data: riskMatrix, isLoading } = useQuery({
    queryKey: ['riskMatrix', targetCompanyId],
    queryFn: async () => {
      let query = supabase
        .from('risk_matrix_configurations')
        .select('*')
        .eq('is_active', true);

      if (targetCompanyId) {
        query = query.eq('company_id', targetCompanyId);
      } else {
        query = query.is('company_id', null);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching risk matrix:', error);
        throw error;
      }

      return data as RiskMatrixConfig | null;
    }
  });

  const saveRiskMatrix = useMutation({
    mutationFn: async (matrixData: Partial<RiskMatrixConfig>) => {
      const { data, error } = await supabase
        .from('risk_matrix_configurations')
        .upsert({
          company_id: targetCompanyId,
          matrix_size: matrixData.matrix_size,
          row_labels: matrixData.row_labels,
          col_labels: matrixData.col_labels,
          risk_matrix: matrixData.risk_matrix,
          risk_actions: matrixData.risk_actions,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving risk matrix:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskMatrix'] });
      toast.success('Matriz de risco salva com sucesso');
    },
    onError: () => {
      toast.error('Erro ao salvar matriz de risco');
    }
  });

  const calculateRisk = useMutation({
    mutationFn: async ({ severityIndex, probabilityIndex }: { severityIndex: number; probabilityIndex: number }) => {
      const { data, error } = await supabase.rpc('calculate_risk_level', {
        p_company_id: targetCompanyId,
        p_severity_index: severityIndex,
        p_probability_index: probabilityIndex
      });

      if (error) {
        console.error('Error calculating risk:', error);
        throw error;
      }

      return data[0] as RiskCalculation;
    }
  });

  // Migrar dados do localStorage se existirem e não houver configuração no banco
  const migrateFromLocalStorage = useMutation({
    mutationFn: async () => {
      const savedConfig = localStorage.getItem("riskMatrixConfig");
      if (!savedConfig || riskMatrix) return null;

      const config = JSON.parse(savedConfig);
      return saveRiskMatrix.mutateAsync(config);
    },
    onSuccess: () => {
      localStorage.removeItem("riskMatrixConfig");
      toast.success('Configuração migrada do localStorage para o banco de dados');
    }
  });

  return {
    riskMatrix,
    isLoading,
    saveRiskMatrix,
    calculateRisk,
    migrateFromLocalStorage,
  };
}
