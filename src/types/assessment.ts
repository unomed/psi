import { ChecklistTemplate } from "./checklist";

export type AssessmentStatus = "scheduled" | "sent" | "completed";
export type RecurrenceType = "none" | "monthly" | "quarterly" | "semiannual" | "annual";

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
  type?: string; // initial_invite, reminder_3_days, reminder_1_day, final_reminder, completion_confirmation, high_risk_alert, manager_notification, action_plan_created
}
