import { useAuth } from '@/hooks/useAuth';
import { useAutomationConfig } from "./useAutomationConfig";
import { useProcessingLogs } from "./useProcessingLogs";
import { useNotifications } from "./useNotifications";
import { useProcessingStats } from "./useProcessingStats";
import { useConfigMutation, useProcessAssessmentMutation, useMarkNotificationSentMutation } from "./useMutations";

export function usePsychosocialAutomation(companyId?: string) {
  const { userCompanies } = useAuth();

  const targetCompanyId = companyId || (userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : null);

  const { data: config, isLoading: configLoading } = useAutomationConfig(targetCompanyId);
  const { data: processingLogs, isLoading: logsLoading } = useProcessingLogs(targetCompanyId);
  const { data: notifications, isLoading: notificationsLoading } = useNotifications(targetCompanyId);
  const { data: stats, isLoading: statsLoading } = useProcessingStats(targetCompanyId);

  const updateConfig = useConfigMutation(targetCompanyId);
  const processAssessment = useProcessAssessmentMutation();
  const markNotificationSent = useMarkNotificationSentMutation();

  return {
    config,
    processingLogs: processingLogs || [],
    notifications: notifications || [],
    stats,
    isLoading: configLoading || logsLoading || notificationsLoading || statsLoading,
    updateConfig,
    processAssessment,
    markNotificationSent
  };
}

// Re-export types for backward compatibility
export type { 
  PsychosocialAutomationConfig, 
  ProcessingLog, 
  PsychosocialNotification, 
  ProcessingStats 
} from "./types";
