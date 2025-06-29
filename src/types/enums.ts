
// Enums baseados no schema real do banco PostgreSQL
export type ScaleType = 
  | 'psicossocial'    // ✅ ADICIONAR - usado no código
  | 'binary' 
  | 'likert_5'        // ✅ CORRIGIR - era 'likert5'
  | 'likert_7' 
  | 'numeric' 
  | 'percentage' 
  | 'custom'
  | 'yes_no';

export type ChecklistTemplateType = 
  | 'disc' 
  | 'psicossocial' 
  | 'srq20' 
  | 'phq9' 
  | 'gad7' 
  | 'mbi' 
  | 'audit' 
  | 'pss' 
  | 'copsoq' 
  | 'jcq' 
  | 'eri' 
  | 'personal_life' 
  | 'evaluation_360' 
  | 'custom'
  | 'stress';          // ✅ ADICIONAR - valor faltando

export type RecurrenceType = 
  | 'none' 
  | 'daily'           // ✅ ADICIONAR
  | 'weekly'          // ✅ ADICIONAR
  | 'monthly' 
  | 'quarterly' 
  | 'semiannual' 
  | 'annual'
  | 'yearly';         // ✅ ADICIONAR

export type AssessmentStatus = 'scheduled' | 'sent' | 'completed' | 'in_progress';

export enum DiscFactorType {
  D = "D",
  I = "I", 
  S = "S",
  C = "C"
}
