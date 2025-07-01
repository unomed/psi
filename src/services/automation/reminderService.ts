
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReminderConfig {
  type: 'assessment_due' | 'action_plan_overdue' | 'high_risk_alert';
  daysBeforeDue: number[];
  escalationLevels: string[];
  recipientRoles: string[];
}

export class ReminderService {
  static async createReminder(config: {
    entityId: string;
    entityType: 'assessment' | 'action_plan';
    dueDate: string;
    reminderType: string;
    recipients: string[];
  }) {
    try {
      // Use psychosocial_notifications table instead of scheduled_reminders
      const { data, error } = await supabase
        .from('psychosocial_notifications')
        .insert({
          company_id: config.entityId, // This should be company_id from context
          title: this.getReminderTitle(config.reminderType),
          message: this.getReminderMessage(config),
          notification_type: config.reminderType,
          priority: this.getReminderPriority(config.reminderType),
          recipients: config.recipients,
          status: 'pending'
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  static async processScheduledReminders() {
    try {
      // Use psychosocial_notifications for reminders
      const { data: reminders, error } = await supabase
        .from('psychosocial_notifications')
        .select('*')
        .eq('status', 'pending')
        .lte('created_at', new Date().toISOString());

      if (error) throw error;

      for (const reminder of reminders || []) {
        await this.sendReminder(reminder);
        
        // Mark as sent
        await supabase
          .from('psychosocial_notifications')
          .update({ 
            status: 'sent', 
            sent_at: new Date().toISOString() 
          })
          .eq('id', reminder.id);
      }

      return reminders?.length || 0;
    } catch (error) {
      console.error('Error processing reminders:', error);
      throw error;
    }
  }

  private static async sendReminder(reminder: any) {
    try {
      // Send email if configured
      if (reminder.recipients?.length > 0) {
        await supabase.functions.invoke('send-reminder-email', {
          body: {
            recipients: reminder.recipients,
            subject: reminder.title,
            body: reminder.message,
            reminderType: reminder.notification_type
          }
        });
      }

      toast.success(`Lembrete enviado: ${reminder.title}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Erro ao enviar lembrete');
    }
  }

  private static getReminderTitle(type: string): string {
    const titles = {
      assessment_due: 'Avaliação Psicossocial Vencendo',
      action_plan_overdue: 'Plano de Ação em Atraso',
      high_risk_alert: 'Alerta de Risco Alto',
      reassessment_due: 'Reavaliação Necessária'
    };
    return titles[type] || 'Lembrete Automático';
  }

  private static getReminderMessage(reminder: any): string {
    const baseMessage = `Este é um lembrete automático sobre: ${reminder.entityType}`;
    const dueDate = new Date(reminder.dueDate).toLocaleDateString('pt-BR');
    return `${baseMessage}\nData de vencimento: ${dueDate}\nPor favor, tome as ações necessárias.`;
  }

  private static getReminderPriority(type: string): string {
    const priorities = {
      high_risk_alert: 'high',
      action_plan_overdue: 'high',
      assessment_due: 'medium',
      reassessment_due: 'medium'
    };
    return priorities[type] || 'medium';
  }

  static async scheduleAssessmentReminders(assessmentId: string, dueDate: string, companyId: string) {
    const reminderDays = [7, 3, 1]; // 7, 3, and 1 days before due date
    
    for (const days of reminderDays) {
      const reminderDate = new Date(dueDate);
      reminderDate.setDate(reminderDate.getDate() - days);

      await this.createReminder({
        entityId: companyId,
        entityType: 'assessment',
        dueDate: dueDate,
        reminderType: 'assessment_due',
        recipients: [] // Will be populated based on company settings
      });
    }
  }

  static async scheduleActionPlanReminders(actionPlanId: string, dueDate: string, companyId: string) {
    const reminderDays = [14, 7, 3, 1]; // More frequent for action plans
    
    for (const days of reminderDays) {
      const reminderDate = new Date(dueDate);
      reminderDate.setDate(reminderDate.getDate() - days);

      await this.createReminder({
        entityId: companyId,
        entityType: 'action_plan',
        dueDate: dueDate,
        reminderType: 'action_plan_overdue',
        recipients: [] // Will be populated based on responsible users
      });
    }
  }
}
