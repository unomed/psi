
// ===== TIPOS BASE =====
export type AppRole = 'admin' | 'manager' | 'user' | 'employee' | 'evaluator' | 'superadmin';

// ScaleType como string literal
export type ScaleType = 
  | 'psicossocial'
  | 'binary' 
  | 'likert_5'
  | 'likert_7' 
  | 'numeric' 
  | 'percentage' 
  | 'custom'
  | 'yes_no'
  | 'likert5'
  | 'likert';

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'none' | 'semiannual' | 'annual';

// AssessmentStatus como string literal
export type AssessmentStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'scheduled' | 'sent';

export type ChecklistTemplateType = 'disc' | 'psicossocial' | 'stress' | 'custom' | 'srq20' | 'phq9' | 'gad7' | 'mbi' | 'audit' | 'pss' | 'copsoq' | 'jcq' | 'eri' | 'personal_life' | 'evaluation_360';

// ===== INTERFACES PRINCIPAIS =====

// Employee interface completa
export interface Employee {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  start_date: string;
  status: string;
  special_conditions?: string;
  photo_url?: string;
  company_id: string;
  sector_id: string;
  role_id: string;
  employee_type: 'funcionario' | 'candidato';
  employee_tags: string[];
  // Propriedades que o código espera
  role?: {
    id: string;
    name: string;
    risk_level?: string;
    required_tags?: string[];
  };
  sectors?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  start_date: string;
  status: string;
  special_conditions?: string;
  photo_url?: string;
  company_id: string;
  sector_id: string;
  role_id: string;
  employee_type: 'funcionario' | 'candidato';
  employee_tags: string[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  sector_id: string;
  required_skills?: string[];
  risk_level?: string;
  required_tags: string[];
  created_at: string;
  updated_at: string;
}

// Company interfaces
export interface CompanyData {
  id: string;
  name: string;
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  industry?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Compatibilidade com Company
  logoUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  // Compatibilidade com CompanyData
  created_at?: string;
  updated_at?: string;
}

export interface CompanyAccess {
  companyId: string;
  companyName: string;
}

// ChecklistTemplate interface
export interface ChecklistTemplate {
  id: string;
  name: string;
  title?: string; // alias para name
  description?: string;
  category: string;
  scale_type: ScaleType | string;
  is_standard: boolean;
  is_active: boolean;
  estimated_time_minutes: number;
  version: number;
  created_at: string;
  updated_at: string;
  createdAt?: Date; // compatibilidade
  company_id?: string;
  created_by?: string;
  cutoff_scores?: any;
  derived_from_id?: string;
  instructions?: string;
  type?: ChecklistTemplateType;
  questions?: ChecklistQuestion[];
}

export interface Question {
  id: string;
  template_id: string;
  question_text: string;
  order_number: number;
  created_at: string;
  updated_at: string;
  question_type?: string;
  options?: any[];
  required?: boolean;
  reverse_scored?: boolean;
  target_factor?: string;
  weight?: number;
}

export interface ChecklistQuestion extends Question {
  text?: string; // alias para question_text
}

export interface DiscQuestion extends ChecklistQuestion {
  factor: 'D' | 'I' | 'S' | 'C';
  statement: string;
  targetFactor: DiscFactorType;
  weight?: number;
}

// Simplified psychosocial question interface for templates
export interface PsicossocialQuestion {
  id: string;
  text?: string;
  question_text?: string;
  category: string;
  weight?: number;
  // Optional fields for full compatibility
  template_id?: string;
  order_number?: number;
  created_at?: string;
  updated_at?: string;
  target_factor?: string;
  reverse_scored?: boolean;
}

export interface PersonalLifeQuestion extends ChecklistQuestion {
  category: string;
  weight?: number;
  isPrivate?: boolean;
}

export interface Evaluation360Question extends ChecklistQuestion {
  category: string;
  evaluationType: "colleague" | "manager" | "subordinate";
  weight?: number;
}

// ScheduledAssessment - interface única consolidada
export interface ScheduledAssessment {
  id: string;
  employeeId: string; // Obrigatório
  templateId: string;
  scheduledDate: Date;
  sentAt: Date | null;
  linkUrl: string;
  status: string; // Flexível para aceitar qualquer string
  completedAt: Date | null;
  recurrenceType?: RecurrenceType;
  nextScheduledDate?: Date | null;
  phoneNumber?: string;
  company_id?: string;
  employee_name?: string;
  // Campos snake_case para compatibilidade com banco
  employee_id?: string;
  template_id?: string;
  scheduled_date?: string;
  sent_at?: string;
  completed_at?: string;
  link_url?: string;
  // Dados relacionados opcionais
  employees?: {
    name: string;
    email: string;
    phone: string;
  } | null;
  checklist_templates?: {
    title: string;
  } | null;
  // Outros campos necessários
  checklist_template_id?: string;
  employee_ids?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type?: 'initial_invite' | 'reminder_3_days' | 'reminder_1_day' | 'final_reminder' | 'completion_confirmation' | 'high_risk_alert' | 'manager_notification' | 'action_plan_created';
  created_at?: string;
  updated_at?: string;
  description?: string;
}

// ChecklistResult com results flexível
export interface ChecklistResult {
  id: string;
  assessment_response_id?: string;
  templateId: string;
  template_id?: string;
  employeeId?: string;
  employee_id?: string;
  employeeName?: string;
  total_score?: number;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  completed_at?: string;
  completedAt: Date;
  results: any; // Flexível para aceitar qualquer tipo
  dominantFactor: string;
  categorizedResults?: Record<string, number>;
  evaluatedEmployeeId?: string;
  evaluatorEmployeeId?: string;
  isAnonymous?: boolean;
  personalFactors?: Record<string, any>;
  riskCorrelation?: "work" | "personal" | "mixed" | "unknown";
  responses?: any;
  score?: number;
}

export enum DiscFactorType {
  D = 'D',
  I = 'I', 
  S = 'S',
  C = 'C'
}

export interface DiscFactor {
  type: DiscFactorType;
  name: string;
  description: string;
  characteristics: string[];
  score?: number; // Tornar opcional
}

// Auth context interface - Fixed to include all required properties
export interface SimpleAuthContextType {
  user: any | null;
  userRole: AppRole | null;
  userCompanies: any[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// ===== FUNÇÕES UTILITÁRIAS =====
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

// ===== BUSINESS RULES =====
export const BUSINESS_RULES = {
  ASSESSMENT: {
    MAX_QUESTIONS_PER_TEMPLATE: 100,
    MIN_QUESTIONS_PER_TEMPLATE: 1,
    DEFAULT_EXPIRATION_DAYS: 30,
    REMINDER_DAYS: [7, 3, 1]
  },
  RISK_ANALYSIS: {
    SCORE_RANGES: {
      LOW: { min: 0, max: 25 },
      MEDIUM: { min: 26, max: 50 },
      HIGH: { min: 51, max: 75 },
      CRITICAL: { min: 76, max: 100 }
    }
  },
  COMPANY: {
    MAX_EMPLOYEES: 10000,
    MAX_SECTORS: 50,
    MAX_ROLES: 100
  }
};

// ===== VALIDATION SCHEMAS =====
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
};

// ===== SYSTEM CONSTANTS =====
export const SYSTEM_CONSTANTS = {
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
};

// ===== CONSTANTES PARA USO COMO VALORES =====
export const SCALE_TYPES = {
  PSICOSSOCIAL: 'psicossocial',
  BINARY: 'binary',
  LIKERT_5: 'likert_5',
  LIKERT_7: 'likert_7',
  NUMERIC: 'numeric',
  PERCENTAGE: 'percentage',
  CUSTOM: 'custom',
  YES_NO: 'yes_no'
} as const;

export const CHECKLIST_TYPES = {
  DISC: 'disc',
  PSICOSSOCIAL: 'psicossocial',
  SRQ20: 'srq20',
  PHQ9: 'phq9',
  GAD7: 'gad7',
  MBI: 'mbi',
  AUDIT: 'audit',
  PSS: 'pss',
  COPSOQ: 'copsoq',
  JCQ: 'jcq',
  ERI: 'eri',
  PERSONAL_LIFE: 'personal_life',
  EVALUATION_360: 'evaluation_360',
  CUSTOM: 'custom',
  STRESS: 'stress'
} as const;

// Date range type
export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
