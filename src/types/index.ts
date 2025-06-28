export type AppRole = "admin" | "manager" | "user" | "employee" | "evaluator" | "superadmin";

export interface ScheduledAssessment {
  id: string;
  employeeId: string;
  employee_id: string;
  employee_name?: string;
  templateId: string;
  template_id: string;
  scheduledDate: string;
  scheduled_date: string;
  dueDate?: string;
  due_date?: string;
  status: string;
  isRecurring?: boolean;
  is_recurring?: boolean;
  recurrencePattern?: string;
  recurrence_pattern?: string;
  nextScheduledDate?: string;
  next_scheduled_date?: string;
  companyId?: string;
  company_id?: string;
  linkUrl?: string;
  link_url?: string;
  portalToken?: string;
  portal_token?: string;
  createdAt: string;
  created_at: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  title?: string;
  description?: string;
  type: ChecklistTemplateType;
  scale_type: ScaleType;
  is_active: boolean;
  is_standard?: boolean;
  derived_from_id?: string;
  company_id?: string;
  instructions?: string;
  estimated_time_minutes?: number;
  cutoff_scores?: any;
  version: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ChecklistTemplateType = "disc" | "psicossocial" | "custom" | "evaluation_360";
export type ScaleType = "likert_5" | "likert_7" | "binary" | "custom";

export interface ChecklistResult {
  id: string;
  templateId: string;
  employeeId: string;
  responses: any;
  score: number;
  completedAt: string;
  analysis?: any;
}
