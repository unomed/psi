
export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  companyId: string;
  triggerType: 'assessment_completed' | 'risk_detected' | 'deadline_approaching' | 'plan_overdue';
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in_range';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface AutomationAction {
  type: 'send_email' | 'create_notification' | 'escalate_to_manager' | 'create_action_plan' | 'schedule_meeting';
  config: {
    templateId?: string;
    recipients?: string[];
    escalationLevel?: number;
    delayMinutes?: number;
    message?: string;
  };
}

export interface EscalationLevel {
  id: string;
  name: string;
  level: number;
  roleIds: string[];
  userIds: string[];
  notificationMethods: ('email' | 'sms' | 'in_app')[];
  escalationDelayMinutes: number;
}

export interface ManagerNotification {
  id: string;
  managerId: string;
  type: 'high_risk_alert' | 'action_plan_required' | 'deadline_reminder' | 'escalation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  relatedEntityType: 'assessment' | 'action_plan' | 'employee';
  relatedEntityId: string;
  isRead: boolean;
  actionRequired: boolean;
  dueDate?: Date;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface AutomationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  triggerEvent: string;
  executedActions: string[];
  status: 'success' | 'error' | 'partial';
  errorMessage?: string;
  executionTimeMs: number;
  createdAt: Date;
}
