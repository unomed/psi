
import { ChecklistTemplate } from "./checklist";

export type AssessmentStatus = "scheduled" | "sent" | "completed";
export type RecurrenceType = "none" | "monthly" | "semiannual" | "annual";

export interface ScheduledAssessment {
  id: string;
  employeeId: string;
  templateId: string;
  scheduledDate: Date;
  sentAt: Date | null;
  linkUrl: string;
  status: AssessmentStatus;
  completedAt: Date | null;
  recurrenceType?: RecurrenceType;
  nextScheduledDate?: Date | null;
  phoneNumber?: string;
  company_id?: string; // Add company_id field
  // Make employees optional and add possible error state
  employees?: {
    name: string;
    email: string;
    phone: string;
  } | null;
  checklist_templates?: {
    title: string;
  };
}

// Types for email templates
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  description?: string;
}
