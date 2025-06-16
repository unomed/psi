
import { supabase } from "@/integrations/supabase/client";
import { AutomationRule, ManagerNotification, EscalationLevel, AutomationLog } from "@/types/automation";
import { toast } from "sonner";

export class ManagerAutomationService {
  // Processar automação baseada em evento
  static async processAutomationTrigger(
    triggerType: string,
    entityData: any,
    companyId: string
  ): Promise<void> {
    try {
      // Buscar regras ativas para o tipo de trigger
      const { data: rules, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('company_id', companyId)
        .eq('trigger_type', triggerType)
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) throw error;

      for (const rule of rules || []) {
        await this.executeAutomationRule(rule, entityData);
      }
    } catch (error) {
      console.error('Error processing automation trigger:', error);
    }
  }

  // Executar regra de automação
  static async executeAutomationRule(rule: any, entityData: any): Promise<void> {
    const startTime = Date.now();
    const executedActions: string[] = [];
    let status: 'success' | 'error' | 'partial' = 'success';
    let errorMessage: string | undefined;

    try {
      // Verificar condições
      const conditionsMet = this.evaluateConditions(rule.conditions, entityData);
      
      if (!conditionsMet) {
        return; // Condições não atendidas, não executar ações
      }

      // Executar ações
      for (const action of rule.actions || []) {
        try {
          await this.executeAction(action, entityData, rule.company_id);
          executedActions.push(action.type);
        } catch (actionError) {
          console.error(`Error executing action ${action.type}:`, actionError);
          status = 'partial';
          if (!errorMessage) {
            errorMessage = `Failed to execute ${action.type}`;
          }
        }
      }
    } catch (error) {
      status = 'error';
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error executing automation rule:', error);
    } finally {
      // Log da execução
      await this.logAutomationExecution({
        ruleId: rule.id,
        ruleName: rule.name,
        triggerEvent: `${rule.trigger_type}:${entityData.id || 'unknown'}`,
        executedActions,
        status,
        errorMessage,
        executionTimeMs: Date.now() - startTime
      });
    }
  }

  // Avaliar condições da regra
  static evaluateConditions(conditions: any[], entityData: any): boolean {
    if (!conditions || conditions.length === 0) return true;

    let result = true;
    let currentLogicalOp: 'AND' | 'OR' = 'AND';

    for (const condition of conditions) {
      const conditionResult = this.evaluateCondition(condition, entityData);
      
      if (currentLogicalOp === 'AND') {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }

      if (condition.logicalOperator) {
        currentLogicalOp = condition.logicalOperator;
      }
    }

    return result;
  }

  // Avaliar condição individual
  static evaluateCondition(condition: any, entityData: any): boolean {
    const fieldValue = this.getNestedValue(entityData, condition.field);
    const conditionValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        return fieldValue === conditionValue;
      case 'greater_than':
        return Number(fieldValue) > Number(conditionValue);
      case 'less_than':
        return Number(fieldValue) < Number(conditionValue);
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());
      case 'in_range':
        const [min, max] = conditionValue;
        return Number(fieldValue) >= min && Number(fieldValue) <= max;
      default:
        return false;
    }
  }

  // Executar ação específica
  static async executeAction(action: any, entityData: any, companyId: string): Promise<void> {
    switch (action.type) {
      case 'send_email':
        await this.sendAutomationEmail(action.config, entityData, companyId);
        break;
      case 'create_notification':
        await this.createManagerNotification(action.config, entityData, companyId);
        break;
      case 'escalate_to_manager':
        await this.escalateToManager(action.config, entityData, companyId);
        break;
      case 'create_action_plan':
        await this.createAutomaticActionPlan(action.config, entityData, companyId);
        break;
      case 'schedule_meeting':
        await this.scheduleMeeting(action.config, entityData, companyId);
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  // Criar notificação para gestor
  static async createManagerNotification(
    config: any,
    entityData: any,
    companyId: string
  ): Promise<void> {
    const { data: managers, error: managersError } = await supabase
      .from('employees')
      .select('id, name, email')
      .eq('company_id', companyId)
      .eq('role_type', 'manager')
      .eq('status', 'active');

    if (managersError) throw managersError;

    for (const manager of managers || []) {
      const notification: Omit<ManagerNotification, 'id'> = {
        managerId: manager.id,
        type: config.notificationType || 'high_risk_alert',
        priority: config.priority || 'medium',
        title: this.processTemplate(config.title || 'Nova notificação', entityData),
        message: this.processTemplate(config.message || '', entityData),
        relatedEntityType: entityData.entityType || 'assessment',
        relatedEntityId: entityData.id,
        isRead: false,
        actionRequired: config.actionRequired || false,
        dueDate: config.dueDate ? new Date(config.dueDate) : undefined,
        createdAt: new Date(),
        metadata: {
          automationGenerated: true,
          originalEntityData: entityData
        }
      };

      const { error } = await supabase
        .from('manager_notifications')
        .insert(notification);

      if (error) {
        console.error('Error creating manager notification:', error);
      }
    }
  }

  // Escalar para níveis superiores
  static async escalateToManager(
    config: any,
    entityData: any,
    companyId: string
  ): Promise<void> {
    const escalationLevel = config.escalationLevel || 1;
    
    // Buscar configuração de escalação
    const { data: escalationConfig, error } = await supabase
      .from('escalation_levels')
      .select('*')
      .eq('company_id', companyId)
      .eq('level', escalationLevel)
      .single();

    if (error || !escalationConfig) {
      // Criar escalação padrão se não existir
      await this.createDefaultEscalation(companyId, escalationLevel);
      return;
    }

    // Enviar notificações para o nível de escalação
    const recipients = [
      ...(escalationConfig.user_ids || []),
      // Buscar usuários por role se especificado
    ];

    for (const recipientId of recipients) {
      await this.createManagerNotification({
        notificationType: 'escalation',
        priority: 'high',
        title: `Escalação Nível ${escalationLevel}: ${entityData.title || 'Atenção Necessária'}`,
        message: `Este item foi escalado para seu nível de gestão e requer atenção imediata.`,
        actionRequired: true
      }, entityData, companyId);
    }
  }

  // Enviar email automatizado
  static async sendAutomationEmail(
    config: any,
    entityData: any,
    companyId: string
  ): Promise<void> {
    // Buscar template de email se especificado
    let emailTemplate = null;
    if (config.templateId) {
      const { data: template } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', config.templateId)
        .single();
      
      emailTemplate = template;
    }

    const subject = emailTemplate ? 
      this.processTemplate(emailTemplate.subject, entityData) : 
      config.subject || 'Notificação Automática';

    const body = emailTemplate ? 
      this.processTemplate(emailTemplate.body, entityData) : 
      config.message || 'Uma ação automática foi executada.';

    // Usar edge function para enviar email
    const { error } = await supabase.functions.invoke('send-automation-email', {
      body: {
        recipients: config.recipients || [],
        subject,
        body,
        companyId
      }
    });

    if (error) {
      console.error('Error sending automation email:', error);
    }
  }

  // Utilitários
  static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  static processTemplate(template: string, data: any): string {
    let processed = template;
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value || ''));
    });
    return processed;
  }

  static async logAutomationExecution(logData: Omit<AutomationLog, 'id' | 'createdAt'>): Promise<void> {
    const { error } = await supabase
      .from('automation_logs')
      .insert({
        ...logData,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error logging automation execution:', error);
    }
  }

  static async createDefaultEscalation(companyId: string, level: number): Promise<void> {
    const { error } = await supabase
      .from('escalation_levels')
      .insert({
        company_id: companyId,
        name: `Escalação Nível ${level}`,
        level,
        role_ids: [],
        user_ids: [],
        notification_methods: ['email', 'in_app'],
        escalation_delay_minutes: level * 60 // 1 hora por nível
      });

    if (error) {
      console.error('Error creating default escalation:', error);
    }
  }

  static async createAutomaticActionPlan(
    config: any,
    entityData: any,
    companyId: string
  ): Promise<void> {
    // Implementar criação automática de plano de ação
    console.log('Creating automatic action plan...', config, entityData);
  }

  static async scheduleMeeting(
    config: any,
    entityData: any,
    companyId: string
  ): Promise<void> {
    // Implementar agendamento automático de reunião
    console.log('Scheduling meeting...', config, entityData);
  }
}
