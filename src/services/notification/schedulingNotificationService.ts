
import { sendAssessmentEmail } from "./emailNotificationService";

interface NotificationData {
  type: 'email';
  employeeName: string;
  templateName: string;
  scheduledDate: Date;
  linkUrl: string;
  assessmentId: string;
  employeeEmail?: string;
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
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}
