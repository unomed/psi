
import { sendAssessmentEmail } from "./emailNotificationService";
import { sendWhatsAppNotification } from "./whatsappNotificationService";

interface NotificationData {
  type: 'email' | 'whatsapp';
  employeeName: string;
  templateName: string;
  scheduledDate: Date;
  linkUrl: string;
  assessmentId: string;
  employeeEmail?: string;
  phoneNumber?: string;
}

export async function sendSchedulingNotification(data: NotificationData) {
  try {
    if (data.type === 'email' && data.employeeEmail) {
      await sendAssessmentEmail({
        employeeId: '',
        employeeName: data.employeeName,
        employeeEmail: data.employeeEmail,
        assessmentId: data.assessmentId,
        templateName: data.templateName,
        linkUrl: data.linkUrl
      });
    }

    if (data.type === 'whatsapp' && data.phoneNumber) {
      await sendWhatsAppNotification({
        phoneNumber: data.phoneNumber,
        employeeName: data.employeeName,
        templateName: data.templateName,
        scheduledDate: data.scheduledDate,
        linkUrl: data.linkUrl
      });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}
