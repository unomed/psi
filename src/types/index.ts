
// ✅ EXPORTAR CORRETAMENTE:
export type {
  ScaleType,                             // ✅ export type (não valor)
  ChecklistTemplateType,
  RecurrenceType,
  AssessmentStatus
} from './enums';

export { DiscFactorType } from './enums'; // ✅ export valor (enum)

// ✅ EXPORTAR CONSTANTES TAMBÉM:
export { SCALE_TYPES, CHECKLIST_TYPES } from './constants';

// Interfaces principais
export type {
  ChecklistTemplate,
  Question,
  ChecklistResult,
  ChecklistQuestion,
  DiscQuestion,
  PsicossocialQuestion,
  PersonalLifeQuestion,
  Evaluation360Question
} from './checklist';

export type {
  ScheduledAssessment,
  EmailTemplate
} from './assessment';

export type {
  Employee,
  EmployeeFormData,
  Role
} from './employee';

// Company types
export type { Company } from './company';

// App role type
export type AppRole = "admin" | "manager" | "user" | "employee" | "evaluator" | "superadmin";

// ✅ CORRIGIR DiscFactor:
export interface DiscFactor {
  type: DiscFactorType;
  score?: number;                         // ✅ OPCIONAL, não obrigatório
  name?: string;
  description?: string;
  characteristics?: string[];             // ✅ ADICIONAR se usado
}

// ✅ ADICIONAR exports faltando para compatibilidade:
export type { RecurrenceType } from './enums';

// ✅ ADICIONAR constantes para uso como valores se ScaleType for enum:
export const SCALE_TYPE_VALUES = {
  psicossocial: 'psicossocial',
  binary: 'binary', 
  likert_5: 'likert_5',
  likert_7: 'likert_7',
  numeric: 'numeric',
  percentage: 'percentage',
  custom: 'custom',
  yes_no: 'yes_no'
} as const;

// ✅ Permitir tanto enum quanto string:
export type ScaleTypeValue = typeof SCALE_TYPE_VALUES[keyof typeof SCALE_TYPE_VALUES];

// ✅ ADICIONAR tipos para funções que estão sendo importadas:
export type generateUniqueAssessmentLink = (templateId: string, employeeId: string) => string;
export type generateEmployeePortalLink = (token: string) => string;
export type scheduleAssessmentReminders = (assessmentId: string) => Promise<void>;

// ✅ ADICIONAR tipo para dados de empresa:
export interface CompanyData {
  id: string;
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}
