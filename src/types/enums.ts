
// Enums baseados no schema real do banco PostgreSQL
export enum ScaleType {
  PSICOSSOCIAL = 'psicossocial',
  BINARY = 'binary',
  LIKERT_5 = 'likert_5',
  LIKERT_7 = 'likert_7', 
  NUMERIC = 'numeric', 
  PERCENTAGE = 'percentage', 
  CUSTOM = 'custom',
  YES_NO = 'yes_no'
}

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
  | 'stress';

export type RecurrenceType = 
  | 'none' 
  | 'daily'
  | 'weekly'
  | 'monthly' 
  | 'quarterly' 
  | 'semiannual' 
  | 'annual'
  | 'yearly';

export type AssessmentStatus = 'scheduled' | 'sent' | 'completed' | 'in_progress';

export enum DiscFactorType {
  D = "D",
  I = "I", 
  S = "S",
  C = "C"
}
