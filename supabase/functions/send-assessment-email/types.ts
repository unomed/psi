
export interface EmailRequest {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  assessmentId: string;
  templateId: string;
  templateName: string;
  linkUrl: string;
  emailTemplateId?: string;
  customSubject?: string;
  customBody?: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

