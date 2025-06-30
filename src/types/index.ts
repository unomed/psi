export interface CompanyData {
  id?: string;
  name: string; // Required field
  cnpj: string; // Required field
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  industry?: string;
  logo_url?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChecklistResult {
  id: string;
  template_id: string;
  employee_id: string;
  templateId: string;
  employeeId: string;
  employee_name?: string;
  employeeName?: string;
  templateName?: string;
  responses: Json;
  results: Json;
  score: number;
  completedAt: Date;
  createdBy: string;
  dominant_factor?: string;
  dominantFactor?: string;
  total_score?: number;
  risk_level?: string;
}

export interface ScheduledAssessment {
  id: string;
  template_id: string;
  employee_id: string;
  scheduled_date: string;
  status: "scheduled" | "sent" | "completed" | "pending";
  company_id?: string;
  created_at?: string;
  // Legacy compatibility properties
  templateId?: string;
  employeeId?: string;
  scheduledDate?: Date;
  sentAt?: Date | null;
  sent_at?: string | null;
  completedAt?: Date | null;
  completed_at?: string | null;
  linkUrl?: string;
  link_url?: string | null;
  checklist_templates?: {
    title: string;
  };
  employees?: {
    name: string;
    email?: string;
    phone?: string;
  };
  employee_name?: string;
  checklist_template_id?: string;
  employee_ids?: string[];
  nextScheduledDate?: Date;
  next_scheduled_date?: string | null;
  recurrence_type?: RecurrenceType;
  phoneNumber?: string;
  portal_token?: string;
  due_date?: string;
}

export type ScaleType = 
  | "custom"
  | "psicossocial"
  | "likert5"
  | "likert7"
  | "numeric"
  | "likert"
  | "yes_no"
  | "frequency"
  | "binary"
  | "percentage"
  | "stanine"
  | "percentile"
  | "tscore"
  | "range10";

export type AppRole = "superadmin" | "admin" | "user" | "employee";

export type EmailTemplateType = 
  | ""
  | "high_risk_alert"
  | "initial_invite"
  | "reminder_3_days"
  | "reminder_1_day"
  | "final_reminder"
  | "completion_confirmation"
  | "manager_notification"
  | "action_plan_created";

export type AssessmentStatus = "scheduled" | "sent" | "completed" | "pending";

export interface ChecklistTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  category: "default" | "psicossocial";
  type:
  | "custom"
  | "psicossocial"
  | "disc"
  | "srq20"
  | "phq9"
  | "gad7"
  | "mbi"
  | "audit"
  | "pss"
  | "copsoq"
  | "jcq"
  | "eri"
  | "personal_life"
  | "evaluation_360";
  scale_type: ScaleType;
  is_standard: boolean;
  is_active: boolean;
  estimated_time_minutes: number;
  version: number;
  created_at: string;
  updated_at: string;
  company_id?: string;
  created_by?: string;
  cutoff_scores?: {
    high: number;
    medium: number;
    low: number;
  };
  derived_from_id?: string;
  instructions?: string;
  interpretation_guide?: string;
  max_score?: number;
  questions?: ChecklistQuestion[];
  createdAt?: Date;
}

export interface ChecklistQuestion {
  id: string;
  template_id: string;
  question_text: string;
  text: string;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_id: string;
  sector_id?: string;
  role_id?: string;
  created_at?: string;
  updated_at?: string;
  birthdate?: string;
  gender?: string;
  start_date?: string;
  end_date?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_email?: string;
  notes?: string;
  status?: string;
}

export interface RoleData {
  id: string;
  name: string;
  description?: string;
  riskLevel?: "high" | "medium" | "low";
  requiredSkills?: string[];
  created_at?: string;
  updated_at?: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "quarterly" | "semiannual" | "annual";

export interface PeriodicitySettings {
  id: string;
  default_periodicity: PeriodicityType;
  risk_high_periodicity: PeriodicityType;
  risk_medium_periodicity: PeriodicityType;
  risk_low_periodicity: PeriodicityType;
}

export interface Settings {
  id: string;
  company_id: string;
  assessment_reminder_days: number;
  assessment_completion_days: number;
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: string;
  role: string;
  permissions: {
    view_dashboard: boolean;
    manage_users: boolean;
    manage_companies: boolean;
    view_billing: boolean;
    manage_permissions: boolean;
    view_settings: boolean;
    manage_templates: boolean;
    run_assessments: boolean;
    view_reports: boolean;
  };
}

export interface NR01ActionPlan {
  id?: string;
  company_id: string;
  risk_id: string;
  title: string;
  description?: string;
  responsible_person: string;
  start_date: string;
  due_date: string;
  status: "open" | "in_progress" | "completed" | "overdue";
  created_at?: string;
  updated_at?: string;
}

export interface NR01Risk {
  id?: string;
  company_id: string;
  sector_id: string;
  role_id: string;
  risk_description: string;
  risk_level: "high" | "medium" | "low";
  control_measures: string;
  created_at?: string;
  updated_at?: string;
}

export interface NR01Sector {
  id?: string;
  company_id: string;
  name: string;
  description?: string;
  responsible_person?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NR01Role {
  id?: string;
  company_id: string;
  name: string;
  description?: string;
  risk_level: "high" | "medium" | "low";
  required_skills?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TagType {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeTag {
  id: string;
  employee_id: string;
  tag_type_id: string;
  expiry_date?: string;
  created_at?: string;
  updated_at?: string;
  tag_type?: TagType;
}

export interface RoleRequiredTag {
  id: string;
  role_id: string;
  tag_type_id: string;
  created_at?: string;
  updated_at?: string;
  tag_type?: TagType;
}

export const generateUniqueAssessmentLink = (templateId: string, employeeId: string): string => {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return `/assessment/${templateId}/${employeeId}?token=${token}`;
};
