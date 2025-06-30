
// Tipos principais do sistema - VERSÃO CORRIGIDA E UNIFICADA
export type ScaleType = "likert" | "yes_no" | "custom" | "frequency" | "numeric" | "likert5" | "binary" | "percentage" | "psicossocial" | "likert_5" | "stanine" | "percentile" | "tscore" | "range10";

export type ChecklistTemplateType = "psicossocial" | "disc" | "custom" | "360" | "standard" | "stress" | "srq20" | "phq9" | "gad7" | "mbi" | "audit" | "pss" | "copsoq" | "jcq" | "eri" | "personal_life" | "evaluation_360";

export type RiskLevel = "baixo" | "medio" | "alto" | "critico";

// Tipos de recorrência COMPLETOS
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "semiannual" | "annual";

// App Role type - CORRIGIDO
export type AppRole = "superadmin" | "admin" | "evaluator" | "profissionais" | "user";

// Email Template Types - EXPANDIDO
export type EmailTemplateType = "" | "initial_invite" | "reminder_3_days" | "reminder_1_day" | "final_reminder" | "completion_confirmation" | "high_risk_alert" | "manager_notification" | "action_plan_created";

// Company Data type - EXPANDIDO
export interface CompanyData {
  id: string;
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  industry?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
  notes?: string; // ADICIONADO
  created_at?: string;
  updated_at?: string;
}

// DiscFactorType como enum E union type para funcionar tanto como tipo quanto valor
export enum DiscFactorType {
  D = "D",
  I = "I", 
  S = "S",
  C = "C"
}

export type DiscFactorTypeUnion = "D" | "I" | "S" | "C";

// Interface ScheduledAssessment COMPLETA com todas as propriedades necessárias
export interface ScheduledAssessment {
  id: string;
  template_id: string;
  employee_id: string;
  scheduled_date: string;
  status: string;
  recurrence_type?: RecurrenceType;
  created_at?: string;
  
  // Propriedades adicionais para compatibilidade
  templateId?: string; // camelCase para compatibilidade
  employeeId?: string; // camelCase para compatibilidade
  scheduledDate?: Date; // camelCase para compatibilidade
  recurrenceType?: RecurrenceType; // camelCase para compatibilidade
  phoneNumber?: string;
  phone_number?: string;
  linkUrl?: string;
  link_url?: string;
  sentAt?: Date | null;
  sent_at?: string | null;
  completedAt?: Date | null;
  completed_at?: string | null;
  company_id?: string;
  employee_name?: string;
  
  // Objetos relacionados
  employees?: {
    name: string;
    email: string;
    phone: string;
  };
  checklist_templates?: {
    title: string;
  };
}

// Interface EmailTemplate COMPLETA
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables?: any;
  created_at?: string;
  
  // Propriedades adicionais - type agora usa o union type específico
  type?: EmailTemplateType; // CORRIGIDO - usa o tipo específico
  description?: string;
}

// Interface ChecklistResult COMPLETA
export interface ChecklistResult {
  id: string;
  template_id: string;
  employee_id: string;
  employee_name?: string;
  employeeName?: string; // camelCase para compatibilidade
  responses: Record<string, any>;
  results: Record<string, number>;
  dominant_factor?: string;
  dominantFactor?: string; // camelCase para compatibilidade
  raw_score?: number;
  normalized_score?: number;
  percentile?: number;
  stanine?: number;
  tscore?: number;
  classification?: string;
  factors_scores?: Record<string, number>;
  categorized_results?: Record<string, number>;
  categorizedResults?: Record<string, number>; // camelCase para compatibilidade
  completed_at?: string;
  completedAt?: string; // camelCase para compatibilidade
  created_by?: string;
  notes?: string;
  templateId?: string; // camelCase para compatibilidade
}

// Interface DiscFactor COMPLETA
export interface DiscFactor {
  name: string;
  description: string;
  characteristics: string[];
  type: DiscFactorType; // Usa o enum
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  title?: string;
  description?: string;
  type: ChecklistTemplateType;
  scale_type: ScaleType;
  scaleType?: ScaleType; // Para compatibilidade
  company_id?: string;
  companyId?: string; // Para compatibilidade
  is_standard?: boolean;
  isStandard?: boolean; // Para compatibilidade
  is_active?: boolean;
  created_at?: string;
  createdAt?: Date; // Para compatibilidade
  updated_at?: string;
  derived_from_id?: string;
  derivedFromId?: string; // Para compatibilidade
  questions?: ChecklistQuestion[];
  instructions?: string;
  estimated_time_minutes?: number;
  interpretation_guide?: string;
  cutoff_scores?: any;
  max_score?: number;
  version?: number;
  created_by?: string;
  category?: string;
}

export interface ChecklistQuestion {
  id: string;
  template_id: string;
  question_text: string;
  text?: string; // Para compatibilidade
  order_number: number;
  target_factor?: string;
  targetFactor?: string; // Para compatibilidade
  weight?: number;
  reverse_scored?: boolean;
  created_at?: string;
}

export interface PsicossocialQuestion {
  id: string;
  template_id?: string;
  question_text?: string;
  text?: string;
  category?: string;
  targetFactor?: string;
  weight?: number;
  order_number?: number;
  reverse_scored?: boolean;
  created_at?: string;
  updated_at?: string; // ADICIONADO
}

export interface DiscQuestion {
  id: string;
  template_id: string;
  question_text: string;
  text?: string; // Para compatibilidade
  factor: string;
  statement: string;
  targetFactor: DiscFactorType;
  weight: number;
  order_number: number;
  reverse_scored?: boolean;
}

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  company_id: string;
  sector_id: string;
  role_id: string;
  role?: any; // Para compatibilidade com componentes antigos
  status: string;
  employee_type: string;
  start_date: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  photo_url?: string;
  special_conditions?: string;
  employee_tags?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeFormData {
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  company_id: string;
  sector_id: string;
  role_id: string;
  status: string;
  employee_type: string;
  start_date: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  photo_url?: string; // ADICIONADO
  special_conditions?: string;
  employee_tags?: any[];
}

export interface ChecklistResponse {
  templateId: string;
  employeeName: string;
  responses: Record<string, string | number>;
  results: Record<string, number>;
  dominantFactor: string;
  categorizedResults: Record<string, number>;
  factorsScores: Record<string, number>;
}

// Utility function - ADICIONADO
export const generateUniqueAssessmentLink = (assessmentId: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://app.exemplo.com';
  return `${baseUrl}/employee-portal/assessment/${assessmentId}`;
};
