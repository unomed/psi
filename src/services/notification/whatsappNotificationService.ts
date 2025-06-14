
import { toast } from "sonner";

interface WhatsAppNotificationData {
  phoneNumber: string;
  employeeName: string;
  templateName: string;
  scheduledDate: Date;
  linkUrl: string;
}

export async function sendWhatsAppNotification(data: WhatsAppNotificationData) {
  // Simular envio do WhatsApp - em produção, integrar com API do WhatsApp Business
  console.log('Sending WhatsApp notification:', data);
  
  const message = `
Olá ${data.employeeName}! 👋

Você tem uma nova avaliação psicossocial agendada:

📋 *${data.templateName}*
📅 Data: ${data.scheduledDate.toLocaleDateString('pt-BR')}

Clique no link abaixo para realizar sua avaliação:
${data.linkUrl}

⚠️ Este link é pessoal e válido por 30 dias.

Em caso de dúvidas, entre em contato conosco.
  `.trim();

  // Em produção, usar uma API como Twilio, WhatsApp Business API, etc.
  // Por ora, apenas logamos e mostramos sucesso
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay da API
  
  toast.success(`WhatsApp enviado para ${data.phoneNumber}`);
  console.log('WhatsApp message:', message);
}
