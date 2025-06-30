
import { ScaleType, ChecklistTemplateType } from './enums';

// ✅ CONSTANTES para usar como valores no código:
export const SCALE_TYPES = {
  PSICOSSOCIAL: 'psicossocial' as const,
  BINARY: 'binary' as const,
  LIKERT_5: 'likert_5' as const,
  LIKERT_7: 'likert_7' as const,
  NUMERIC: 'numeric' as const,
  PERCENTAGE: 'percentage' as const,
  CUSTOM: 'custom' as const,
  YES_NO: 'yes_no' as const,
} satisfies Record<string, ScaleType>;

export const CHECKLIST_TYPES = {
  DISC: 'disc' as const,
  PSICOSSOCIAL: 'psicossocial' as const,
  SRQ20: 'srq20' as const,
  PHQ9: 'phq9' as const,
  GAD7: 'gad7' as const,
  MBI: 'mbi' as const,
  AUDIT: 'audit' as const,
  PSS: 'pss' as const,
  COPSOQ: 'copsoq' as const,
  JCQ: 'jcq' as const,
  ERI: 'eri' as const,
  PERSONAL_LIFE: 'personal_life' as const,
  EVALUATION_360: 'evaluation_360' as const,
  CUSTOM: 'custom' as const,
  STRESS: 'stress' as const,
} satisfies Record<string, ChecklistTemplateType>;
