
export type {
  ScaleType,
  ChecklistTemplateType,
  RecurrenceType,
  AssessmentStatus
} from './enums';

export { DiscFactorType } from './enums';

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

// ✅ COMPLETAR DiscFactor com propriedades faltando:
export interface DiscFactor {
  type: DiscFactorType;
  score: number;
  name?: string;                          // ✅ ADICIONAR - usado no código
  description?: string;                   // ✅ ADICIONAR - usado no código
}
