
import { supabase } from "@/integrations/supabase/client";

export async function scheduleAssessmentReminders(
  assessmentId: string,
  scheduledDate: Date,
  employeeEmail: string,
  employeeName: string,
  templateTitle: string,
  linkUrl: string
) {
  try {
    console.log('Agendando lembretes para avaliação:', {
      assessmentId,
      scheduledDate,
      employeeEmail,
      employeeName,
      templateTitle
    });

    // Por enquanto, apenas fazemos log dos lembretes que seriam agendados
    // Em uma implementação real, isso seria integrado com um sistema de email automation
    
    const reminders = [
      {
        type: 'initial',
        sendDate: new Date(), // Imediatamente
        subject: `Avaliação Agendada: ${templateTitle}`,
        message: `Olá ${employeeName}, sua avaliação "${templateTitle}" foi agendada para ${scheduledDate.toLocaleDateString('pt-BR')}. Link: ${linkUrl}`
      },
      {
        type: 'reminder_3_days',
        sendDate: new Date(scheduledDate.getTime() - (3 * 24 * 60 * 60 * 1000)), // 3 dias antes
        subject: `Lembrete: Avaliação em 3 dias - ${templateTitle}`,
        message: `Olá ${employeeName}, sua avaliação "${templateTitle}" está agendada para ${scheduledDate.toLocaleDateString('pt-BR')}. Link: ${linkUrl}`
      },
      {
        type: 'reminder_1_day',
        sendDate: new Date(scheduledDate.getTime() - (24 * 60 * 60 * 1000)), // 1 dia antes
        subject: `Lembrete: Avaliação amanhã - ${templateTitle}`,
        message: `Olá ${employeeName}, sua avaliação "${templateTitle}" está agendada para amanhã. Link: ${linkUrl}`
      }
    ];

    console.log('Lembretes que seriam agendados:', reminders);

    // Simular sucesso do agendamento de lembretes
    return { success: true, remindersScheduled: reminders.length };

  } catch (error) {
    console.error('Erro ao agendar lembretes automáticos:', error);
    throw error;
  }
}
