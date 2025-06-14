
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
      const { data, error } = await supabase
        .from('scheduled_reminders')
        .insert({
          entity_id: config.entityId,
          entity_type: config.entityType,
          due_date: config.dueDate,
          reminder_type: config.reminderType,
          recipients: config.recipients,
          status: 'scheduled',
          created_at: new Date().toISOString()
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
      const { data: reminders, error } = await supabase
        .from('scheduled_reminders')
        .select('*')
        .eq('status', 'scheduled')
        .lte('reminder_date', new Date().toISOString());

      if (error) throw error;

      for (const reminder of reminders || []) {
        await this.sendReminder(reminder);
        
        // Mark as sent
        await supabase
          .from('scheduled_reminders')
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
      // Create notification
      await supabase
        .from('psychosocial_notifications')
        .insert({
          company_id: reminder.company_id,
          title: this.getReminderTitle(reminder.reminder_type),
          message: this.getReminderMessage(reminder),
          notification_type: reminder.reminder_type,
          priority: this.getReminderPriority(reminder.reminder_type),
          recipients: reminder.recipients,
          status: 'pending'
        });

      // Send email if configured
      if (reminder.recipients?.length > 0) {
        await supabase.functions.invoke('send-reminder-email', {
          body: {
            recipients: reminder.recipients,
            subject: this.getReminderTitle(reminder.reminder_type),
            body: this.getReminderMessage(reminder),
            reminderType: reminder.reminder_type
          }
        });
      }

      toast.success(`Lembrete enviado: ${this.getReminderTitle(reminder.reminder_type)}`);
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
    const baseMessage = `Este é um lembrete automático sobre: ${reminder.entity_type}`;
    const dueDate = new Date(reminder.due_date).toLocaleDateString('pt-BR');
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
        entityId: assessmentId,
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
        entityId: actionPlanId,
        entityType: 'action_plan',
        dueDate: dueDate,
        reminderType: 'action_plan_overdue',
        recipients: [] // Will be populated based on responsible users
      });
    }
  }
}
