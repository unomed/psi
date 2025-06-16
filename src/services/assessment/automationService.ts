
import { supabase } from "@/integrations/supabase/client";
import { sendAssessmentEmail } from "@/services/notification/emailNotificationService";
import { toast } from "sonner";

interface ScheduleReminderParams {
  assessmentId: string;
  employeeEmail: string;
  employeeName: string;
  templateName: string;
  linkUrl: string;
  reminderType: 'initial' | 'reminder_3_days' | 'reminder_1_day' | 'final_reminder';
}

export async function scheduleAssessmentReminders(
  scheduledAssessmentId: string,
  scheduledDate: Date,
  employeeEmail: string,
  employeeName: string,
  templateName: string,
  linkUrl: string
) {
  try {
    // Immediate email
    await sendAssessmentEmail({
      employeeId: '',
      employeeName,
      employeeEmail,
      assessmentId: scheduledAssessmentId,
      templateName,
      linkUrl,
      customSubject: `Nova Avaliação: ${templateName}`,
      customBody: getEmailTemplate('initial', employeeName, templateName, linkUrl, scheduledDate)
    });

    // Schedule reminders using edge functions or database triggers
    const reminders = [
      { type: 'reminder_3_days', days: 3 },
      { type: 'reminder_1_day', days: 1 },
      { type: 'final_reminder', days: 0 }
    ];

    for (const reminder of reminders) {
      const reminderDate = new Date(scheduledDate);
      reminderDate.setDate(reminderDate.getDate() - reminder.days);

      if (reminderDate > new Date()) {
        await scheduleEmailReminder({
          assessmentId: scheduledAssessmentId,
          employeeEmail,
          employeeName,
          templateName,
          linkUrl,
          reminderType: reminder.type as any,
          scheduledFor: reminderDate
        });
      }
    }

    return true;
  } catch (error) {
    console.error("Error scheduling assessment reminders:", error);
    throw error;
  }
}

async function scheduleEmailReminder(params: ScheduleReminderParams & { scheduledFor: Date }) {
  // Insert reminder into database for later processing
  const { error } = await supabase
    .from('assessment_emails')
    .insert({
      scheduled_assessment_id: params.assessmentId,
      recipient_email: params.employeeEmail,
      subject: getEmailSubject(params.reminderType, params.templateName),
      body: getEmailTemplate(params.reminderType, params.employeeName, params.templateName, params.linkUrl),
      scheduled_for: params.scheduledFor.toISOString(),
      status: 'scheduled'
    });

  if (error) {
    console.error("Error scheduling email reminder:", error);
    throw error;
  }
}

function getEmailSubject(type: string, templateName: string): string {
  switch (type) {
    case 'initial':
      return `Nova Avaliação Disponível: ${templateName}`;
    case 'reminder_3_days':
      return `Lembrete: Avaliação ${templateName} - 3 dias restantes`;
    case 'reminder_1_day':
      return `Urgente: Avaliação ${templateName} - 1 dia restante`;
    case 'final_reminder':
      return `Último Lembrete: Avaliação ${templateName} - Prazo hoje`;
    default:
      return `Avaliação: ${templateName}`;
  }
}

function getEmailTemplate(
  type: string, 
  employeeName: string, 
  templateName: string, 
  linkUrl: string, 
  scheduledDate?: Date
): string {
  const baseTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Sistema de Avaliações</h1>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Olá, <strong>${employeeName}</strong>!
        </p>
        
        ${getEmailContent(type, templateName, scheduledDate)}
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Sobre esta avaliação:</h3>
          <p style="color: #6c757d; margin-bottom: 10px;"><strong>Tipo:</strong> ${templateName}</p>
          ${scheduledDate ? `<p style="color: #6c757d; margin-bottom: 10px;"><strong>Prazo:</strong> ${scheduledDate.toLocaleDateString('pt-BR')}</p>` : ''}
          <p style="color: #6c757d; margin: 0;"><strong>Confidencialidade:</strong> Suas respostas são confidenciais e utilizadas apenas para melhorar o ambiente de trabalho.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${linkUrl}" 
             style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Responder Avaliação
          </a>
        </div>
        
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Se você tiver dúvidas, entre em contato com o departamento de RH.</p>
          <p><em>Este é um email automático, não responda a esta mensagem.</em></p>
        </div>
      </div>
    </div>
  `;

  return baseTemplate;
}

function getEmailContent(type: string, templateName: string, scheduledDate?: Date): string {
  switch (type) {
    case 'initial':
      return `
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Uma nova avaliação foi agendada para você. Esta avaliação é importante para 
          entendermos melhor o ambiente de trabalho e identificar oportunidades de melhoria.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Por favor, reserve alguns minutos do seu tempo para responder às questões. 
          Suas respostas são fundamentais para criarmos um ambiente de trabalho mais saudável e produtivo.
        </p>
      `;
    case 'reminder_3_days':
      return `
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Este é um lembrete gentil de que você tem uma avaliação pendente que deve ser 
          completada nos próximos 3 dias.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Se você ainda não respondeu, por favor, dedique alguns minutos para completar a avaliação.
        </p>
      `;
    case 'reminder_1_day':
      return `
        <p style="font-size: 16px; color: #d73027; line-height: 1.6;">
          <strong>Atenção:</strong> Sua avaliação deve ser completada até amanhã!
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Este é um lembrete importante de que o prazo para completar sua avaliação está se aproximando. 
          Por favor, acesse o link e responda às questões o quanto antes.
        </p>
      `;
    case 'final_reminder':
      return `
        <p style="font-size: 16px; color: #d73027; line-height: 1.6;">
          <strong>ÚLTIMO LEMBRETE:</strong> Sua avaliação deve ser completada hoje!
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Este é o último lembrete sobre sua avaliação pendente. É muito importante que você 
          complete esta avaliação hoje para que possamos continuar melhorando nosso ambiente de trabalho.
        </p>
      `;
    default:
      return `
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Você tem uma avaliação disponível para responder.
        </p>
      `;
  }
}

export async function sendManagerNotification(
  managerId: string,
  managerEmail: string,
  managerName: string,
  notification: {
    type: 'high_risk_alert' | 'action_plan_created' | 'assessment_completed';
    employeeName: string;
    templateName: string;
    riskLevel?: string;
    actionPlanId?: string;
    details?: any;
  }
) {
  try {
    const subject = getManagerNotificationSubject(notification.type, notification.employeeName);
    const body = getManagerNotificationTemplate(managerName, notification);

    await sendAssessmentEmail({
      employeeId: managerId,
      employeeName: managerName,
      employeeEmail: managerEmail,
      assessmentId: '', // Not applicable for manager notifications
      templateName: notification.templateName,
      linkUrl: `${window.location.origin}/dashboard`, // Link to manager dashboard
      customSubject: subject,
      customBody: body
    });

    return true;
  } catch (error) {
    console.error("Error sending manager notification:", error);
    throw error;
  }
}

function getManagerNotificationSubject(type: string, employeeName: string): string {
  switch (type) {
    case 'high_risk_alert':
      return `🚨 Alerta de Risco Alto - ${employeeName}`;
    case 'action_plan_created':
      return `📋 Plano de Ação Criado - ${employeeName}`;
    case 'assessment_completed':
      return `✅ Avaliação Completada - ${employeeName}`;
    default:
      return `Notificação - ${employeeName}`;
  }
}

function getManagerNotificationTemplate(managerName: string, notification: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Notificação para Gestores</h1>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Olá, <strong>${managerName}</strong>!
        </p>
        
        ${getManagerNotificationContent(notification)}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${window.location.origin}/dashboard" 
             style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Acessar Dashboard
          </a>
        </div>
        
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Este é um email automático do sistema de gestão de riscos psicossociais.</p>
          <p><em>Para mais detalhes, acesse o dashboard do sistema.</em></p>
        </div>
      </div>
    </div>
  `;
}

function getManagerNotificationContent(notification: any): string {
  switch (notification.type) {
    case 'high_risk_alert':
      return `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">🚨 Alerta de Risco Alto</h3>
          <p style="color: #856404; margin-bottom: 10px;">
            <strong>Funcionário:</strong> ${notification.employeeName}
          </p>
          <p style="color: #856404; margin-bottom: 10px;">
            <strong>Avaliação:</strong> ${notification.templateName}
          </p>
          <p style="color: #856404; margin-bottom: 10px;">
            <strong>Nível de Risco:</strong> ${notification.riskLevel}
          </p>
          <p style="color: #856404; margin: 0;">
            É recomendado que você tome ações imediatas para mitigar este risco.
          </p>
        </div>
      `;
    case 'action_plan_created':
      return `
        <div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #0c5460; margin-top: 0;">📋 Plano de Ação Criado</h3>
          <p style="color: #0c5460; margin-bottom: 10px;">
            <strong>Funcionário:</strong> ${notification.employeeName}
          </p>
          <p style="color: #0c5460; margin-bottom: 10px;">
            <strong>Baseado na avaliação:</strong> ${notification.templateName}
          </p>
          <p style="color: #0c5460; margin: 0;">
            Um plano de ação foi automaticamente gerado. Revise e acompanhe a implementação.
          </p>
        </div>
      `;
    case 'assessment_completed':
      return `
        <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #155724; margin-top: 0;">✅ Avaliação Completada</h3>
          <p style="color: #155724; margin-bottom: 10px;">
            <strong>Funcionário:</strong> ${notification.employeeName}
          </p>
          <p style="color: #155724; margin-bottom: 10px;">
            <strong>Avaliação:</strong> ${notification.templateName}
          </p>
          <p style="color: #155724; margin: 0;">
            A avaliação foi completada com sucesso. Os resultados estão disponíveis no dashboard.
          </p>
        </div>
      `;
    default:
      return `<p>Notificação sobre ${notification.employeeName}</p>`;
  }
}
