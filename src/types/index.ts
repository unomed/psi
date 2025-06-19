
export interface ChecklistTemplate {
  id: string;
  title: string;
  description?: string;
  type: 'custom' | 'srq20' | 'phq9' | 'gad7' | 'mbi' | 'audit' | 'pss' | 'copsoq' | 'jcq' | 'eri' | 'disc' | 'psicossocial' | 'personal_life' | 'evaluation_360';
  scale_type: 'likert5' | 'binary' | 'percentage' | 'numeric';
  company_id?: string;
  created_by?: string;
  is_active: boolean;
  version: number;
  max_score?: number;
  cutoff_scores?: any;
  instructions?: string;
  interpretation_guide?: string;
  estimated_time_minutes?: number;
  is_standard?: boolean;
  derived_from_id?: string;
  questions?: Question[];
  createdAt: Date;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  template_id: string;
  question_text: string;
  order_number: number;
  target_factor?: string;
  weight?: number;
  reverse_scored?: boolean;
  created_at: string;
}

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual';

export type AssessmentStatus = 'scheduled' | 'sent' | 'completed' | 'pending' | 'in_progress' | 'cancelled';

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
  company_id?: string;
  employee_name?: string;
  employees?: {
    name: string;
    email: string;
    phone: string;
  } | null;
  checklist_templates?: {
    title: string;
  } | null;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  description?: string;
  type?: 'initial_invite' | 'reminder_3_days' | 'reminder_1_day' | 'final_reminder' | 'completion_confirmation' | 'high_risk_alert' | 'manager_notification' | 'action_plan_created';
  created_at?: string;
  updated_at?: string;
}

export interface ChecklistResult {
  id: string;
  templateId: string;
  employeeId?: string;
  employeeName?: string;
  results: {
    D: number;
    I: number;
    S: number;
    C: number;
  } | Record<string, number>;
  dominantFactor: string;
  categorizedResults?: Record<string, number>;
  completedAt: Date;
  evaluatedEmployeeId?: string;
  evaluatorEmployeeId?: string;
  isAnonymous?: boolean;
  personalFactors?: Record<string, any>;
  riskCorrelation?: "work" | "personal" | "mixed" | "unknown";
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  industry?: string;
  logoUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Utility functions (mocked for now)
export const generateUniqueAssessmentLink = (assessmentId: string): string => {
  return `${window.location.origin}/assessment/${assessmentId}?token=${Math.random().toString(36).substr(2, 9)}`;
};

export const generateEmployeePortalLink = (employeeId: string): string => {
  return `${window.location.origin}/employee/portal/${employeeId}?token=${Math.random().toString(36).substr(2, 9)}`;
};

export const scheduleAssessmentReminders = async (assessmentId: string, dates: Date[]): Promise<void> => {
  console.log('Scheduling reminders for assessment:', assessmentId, dates);
  // Implementation would go here
};
