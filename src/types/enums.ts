
// ✅ ScaleType como STRING UNION TYPE (não enum)
export type ScaleType = 
  | 'psicossocial'    // ✅ lowercase string
  | 'binary' 
  | 'likert_5'        // ✅ lowercase string
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

// ✅ ESTE PODE SER ENUM:
export enum DiscFactorType {
  D = "D",
  I = "I", 
  S = "S",
  C = "C"
}
