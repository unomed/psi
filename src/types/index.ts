
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
