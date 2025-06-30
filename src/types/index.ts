
// Tipos principais do sistema
export type ScaleType = "likert" | "yes_no" | "custom" | "frequency" | "numeric";

export type ChecklistTemplateType = "psicossocial" | "disc" | "custom" | "360" | "standard";

export type RiskLevel = "baixo" | "medio" | "alto" | "critico";

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
  order_number: number;
  target_factor?: string;
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
