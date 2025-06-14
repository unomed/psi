
// Re-export types for backward compatibility
export type { AutomationTriggerResult, NotificationTemplate } from "./types/automationTypes";

// Re-export all services for backward compatibility
export { AutomationConfigService } from "./automation/configService";
export { AutomationLogsService } from "./automation/logsService";
export { AutomationNotificationsService } from "./automation/notificationsService";
export { AutomationStatisticsService } from "./automation/statisticsService";
export { AutomationProcessingService } from "./automation/processingService";

// Import services for use in the main class
import { AutomationConfigService } from "./automation/configService";
import { AutomationLogsService } from "./automation/logsService";
import { AutomationNotificationsService } from "./automation/notificationsService";
import { AutomationStatisticsService } from "./automation/statisticsService";
import { AutomationProcessingService } from "./automation/processingService";

// Main service class that combines all functionality
export class PsychosocialAutomationService {
  // Processar avaliação automaticamente
  static triggerAutomaticProcessing = AutomationProcessingService.triggerAutomaticProcessing;

  // Obter configuração de automação
  static getAutomationConfig = AutomationConfigService.getAutomationConfig;

  // Criar configuração padrão para empresa
  static createDefaultConfig = AutomationConfigService.createDefaultConfig;

  // Obter logs de processamento recentes
  static getRecentProcessingLogs = AutomationLogsService.getRecentProcessingLogs;

  // Obter notificações pendentes
  static getPendingNotifications = AutomationNotificationsService.getPendingNotifications;

  // Marcar notificação como enviada
  static markNotificationSent = AutomationNotificationsService.markNotificationSent;

  // Obter estatísticas de automação
  static getAutomationStats = AutomationStatisticsService.getAutomationStats;

  // Templates de notificação
  static getNotificationTemplates = AutomationNotificationsService.getNotificationTemplates;

  // Simular processamento para teste
  static simulateProcessing = AutomationProcessingService.simulateProcessing;
}
