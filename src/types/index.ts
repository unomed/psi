
// Tipos principais do sistema - VERSÃO CONSOLIDADA
export type ScaleType = "likert" | "yes_no" | "custom" | "frequency" | "numeric" | "likert5" | "binary" | "percentage" | "psicossocial" | "likert_5";

export type ChecklistTemplateType = "psicossocial" | "disc" | "custom" | "360" | "standard" | "stress";

export type RiskLevel = "baixo" | "medio" | "alto" | "critico";

// Tipos adicionais necessários
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export interface ScheduledAssessment {
  id: string;
  template_id: string;
  employee_id: string;
  scheduled_date: string;
  status: string;
  recurrence_type?: RecurrenceType;
  created_at?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables?: any;
  created_at?: string;
}

export interface ChecklistResult {
  id: string;
  template_id: string;
  employee_id: string;
  employee_name?: string;
  responses: Record<string, any>;
  results: Record<string, number>;
  dominant_factor?: string;
  raw_score?: number;
  normalized_score?: number;
  percentile?: number;
  stanine?: number;
  tscore?: number;
  classification?: string;
  factors_scores?: Record<string, number>;
  categorized_results?: Record<string, number>;
  completed_at?: string;
  created_by?: string;
  notes?: string;
}

export interface DiscFactor {
  name: string;
  description: string;
  characteristics: string[];
}

export type DiscFactorType = "D" | "I" | "S" | "C";

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
}

export interface DiscQuestion {
  id: string;
  template_id: string;
  question_text: string;
  text?: string; // Para compatibilidade
  factor: string;
  statement: string;
  targetFactor: string;
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
