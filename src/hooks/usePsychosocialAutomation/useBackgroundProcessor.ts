
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BackgroundProcessor } from "@/services/riskManagement/automation/backgroundProcessor";
import { toast } from "sonner";

export function useBackgroundProcessor() {
  const queryClient = useQueryClient();

  // Status do processamento
  const { data: processingStatus, isLoading } = useQuery({
    queryKey: ['backgroundProcessingStatus'],
    queryFn: BackgroundProcessor.getProcessingStatus,
    refetchInterval: 5000, // Atualizar a cada 5 segundos
  });

  // Adicionar job à fila
  const queueJob = useMutation({
    mutationFn: ({ 
      assessmentResponseId, 
      companyId, 
      priority = 'medium' 
    }: { 
      assessmentResponseId: string; 
      companyId: string; 
      priority?: 'low' | 'medium' | 'high' | 'critical' 
    }) => BackgroundProcessor.queueProcessingJob(assessmentResponseId, companyId, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backgroundProcessingStatus'] });
      toast.success('Processamento adicionado à fila');
    },
    onError: () => {
      toast.error('Erro ao adicionar processamento à fila');
    }
  });

  // Parar processamento
  const stopProcessing = useMutation({
    mutationFn: () => {
      BackgroundProcessor.stopProcessing();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backgroundProcessingStatus'] });
      toast.success('Processamento pausado');
    }
  });

  // Reiniciar processamento
  const startProcessing = useMutation({
    mutationFn: () => {
      BackgroundProcessor.startProcessingPublic();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backgroundProcessingStatus'] });
      toast.success('Processamento reiniciado');
    }
  });

  return {
    processingStatus,
    isLoading,
    queueJob,
    stopProcessing,
    startProcessing
  };
}
