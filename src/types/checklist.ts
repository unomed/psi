
import { ScaleType, ChecklistTemplateType } from './enums';

export interface Question {
  id: string;
  template_id: string;
  question_text: string;
  order_number: number;
  target_factor?: string;
  weight?: number;
  reverse_scored?: boolean;
  created_at: string;
  updated_at?: string;                    // ✅ ADICIONAR propriedade faltando
  // Compatibility fields
  text?: string;
  targetFactor?: string;
  category?: string;
}

export interface ChecklistTemplate {
  id: string;
  title: string;                          // ✅ Campo correto do banco
  name?: string;                          // ✅ Manter para compatibilidade
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
  max_score?: number;
  interpretation_guide?: string;
  version: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  createdAt?: Date;                       // ✅ Manter para compatibilidade
  updatedAt?: Date;                       // ✅ Manter para compatibilidade
  
  // ✅ ADICIONAR - propriedades faltando:
  questions?: Question[];                 // ✅ Relacionamento 1:N
  category?: string;                      // ✅ Usado no código
}

export interface ChecklistResult {
  id: string;
  templateId: string;
  employeeId: string;
  responses: any;
  score: number;
  completedAt: string;
  analysis?: any;
  
  // ✅ ADICIONAR - propriedades faltando:
  employeeName?: string;                  // ✅ Usado no código
  dominantFactor?: string;                // ✅ Usado no código
  results?: any;                          // ✅ ADICIONAR - usado no código
  categorizedResults?: any;               // ✅ ADICIONAR - usado no código
}

// Aliases for compatibility
export type ChecklistQuestion = Question;
export type DiscQuestion = Question;
export type PsicossocialQuestion = Question;
export type PersonalLifeQuestion = Question;
export type Evaluation360Question = Question;
