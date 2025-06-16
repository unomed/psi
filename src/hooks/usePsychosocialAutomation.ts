
import { useQuery } from "@tanstack/react-query";
import { AutomationProcessingService } from "@/services/riskManagement/automation/processingService";
import { AutomationLogsService } from "@/services/riskManagement/automation/logsService";
import { AutomationStatisticsService } from "@/services/riskManagement/automation/statisticsService";

export function usePsychosocialAutomation(companyId?: string) {
  // Buscar logs de processamento
  const { data: processingLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['psychosocialProcessingLogs', companyId],
    queryFn: () => AutomationLogsService.getRecentProcessingLogs(companyId!),
    enabled: !!companyId,
    refetchInterval: 30000, // Refetch a cada 30 segundos
  });

  // Buscar estatísticas
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['psychosocialProcessingStats', companyId],
    queryFn: () => AutomationStatisticsService.getAutomationStats(companyId!),
    enabled: !!companyId,
    refetchInterval: 60000, // Refetch a cada minuto
  });

  // Simular processamento
  const simulateProcessing = async () => {
    if (!companyId) throw new Error('Company ID is required');
    return AutomationProcessingService.simulateProcessing(companyId);
  };

  return {
    processingLogs,
    stats,
    isLoading: logsLoading || statsLoading,
    simulateProcessing,
  };
}
