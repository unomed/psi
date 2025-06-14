
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  PsychosocialRiskConfigService, 
  PsychosocialRiskConfig 
} from "@/services/riskManagement/psychosocialRiskConfig";

export function usePsychosocialRiskConfig(companyId?: string) {
  const queryClient = useQueryClient();
  const { userCompanies } = useAuth();

  const targetCompanyId = companyId || (userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : null);

  // Buscar configuração
  const { data: config, isLoading } = useQuery({
    queryKey: ['psychosocialRiskConfig', targetCompanyId],
    queryFn: () => PsychosocialRiskConfigService.getConfig(targetCompanyId!),
    enabled: !!targetCompanyId,
  });

  // Atualizar configuração
  const updateConfig = useMutation({
    mutationFn: (newConfig: PsychosocialRiskConfig) => 
      PsychosocialRiskConfigService.updateConfig(newConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychosocialRiskConfig'] });
      toast.success('Configurações de risco psicossocial atualizadas com sucesso');
    },
    onError: (error) => {
      console.error('Error updating psychosocial risk config:', error);
      toast.error('Erro ao atualizar configurações de risco psicossocial');
    },
  });

  return {
    config,
    isLoading,
    updateConfig,
    validateConfig: PsychosocialRiskConfigService.validateConfig,
  };
}
