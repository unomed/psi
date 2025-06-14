
export interface PsychosocialAutomationConfig {
  id?: string;
  company_id: string;
  auto_process_enabled: boolean;
  auto_generate_action_plans: boolean;
  notification_enabled: boolean;
  notification_recipients: string[];
  processing_delay_minutes: number;
  high_risk_immediate_notification: boolean;
  critical_risk_escalation: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessingLog {
  id: string;
  assessment_response_id: string;
  company_id: string;
  processing_stage: string;
  status: 'processing' | 'completed' | 'error';
  details: Record<string, any>;
  error_message?: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export interface PsychosocialNotification {
  id: string;
  company_id: string;
  risk_analysis_id?: string;
  notification_type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  recipients: string[];
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed';
  metadata: Record<string, any>;
  created_at: string;
}

export interface ProcessingStats {
  total_processed: number;
  successful_processed: number;
  failed_processed: number;
  avg_processing_time_seconds: number;
  high_risk_found: number;
  critical_risk_found: number;
  action_plans_generated: number;
  notifications_sent: number;
}
