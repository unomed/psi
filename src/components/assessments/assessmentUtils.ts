
import { ScheduledAssessment, AssessmentStatus, RecurrenceType } from "@/types";

// Helper function to update a scheduled assessment
export const updateScheduledAssessment = (
  assessments: ScheduledAssessment[],
  assessmentId: string,
  updates: Partial<ScheduledAssessment>
): ScheduledAssessment[] => {
  return assessments.map(a => 
    a.id === assessmentId 
      ? { ...a, ...updates } 
      : a
  );
};

// Helper function to generate a link for an assessment
export const generateAssessmentLink = (templateId: string, employeeId: string | null): string => {
  // In a real app, this would generate a unique token and save it to the database
  // Then return a link with the token
  
  // For now, just return a mock link
  const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  return `${window.location.origin}/avaliacao/${token}`;
};

// Function to calculate the next scheduled date based on recurrence type
export const calculateNextScheduledDate = (currentDate: Date, recurrenceType: RecurrenceType): Date | null => {
  if (recurrenceType === "none") return null;
  
  const nextDate = new Date(currentDate);
  
  switch (recurrenceType) {
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "semiannual":
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case "annual":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      return null;
  }
  
  return nextDate;
};

// Helper function to send assessment email
export const sendAssessmentEmail = async (
  assessmentId: string, 
  assessments: ScheduledAssessment[]
): Promise<ScheduledAssessment[]> => {
  try {
    // Find the scheduled assessment
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment) {
      throw new Error("Avaliação não encontrada.");
    }
    
    // In a real app, this would generate a unique link and send an email
    const link = generateAssessmentLink(assessment.templateId, assessment.employeeId);
    
    // Update the scheduled assessment with the link and sent date
    return updateScheduledAssessment(
      assessments,
      assessmentId,
      {
        sentAt: new Date(),
        linkUrl: link,
        status: "sent" as AssessmentStatus
      }
    );
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
};

// Apply template variables
export const applyTemplateVariables = (
  template: string, 
  variables: { [key: string]: string }
): string => {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  
  return result;
};

// Function to get an email template and fill in the variables
export const getFilledEmailTemplate = (
  templateId: string,
  variables: { [key: string]: string },
  templates: import("@/types").EmailTemplate[]
): { subject: string; body: string } | null => {
  const template = templates.find(t => t.id === templateId);
  
  if (!template) return null;
  
  return {
    subject: applyTemplateVariables(template.subject, variables),
    body: applyTemplateVariables(template.body, variables)
  };
};
