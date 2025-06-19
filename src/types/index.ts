
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
