
export interface AutomationTriggerResult {
  success: boolean;
  log_id?: string;
  analyses_created?: number;
  message: string;
  error?: string;
}

export interface NotificationTemplate {
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}
