// Define basic types
export type RoleType = "admin" | "employee" | "superadmin";

// Scale type definitions
export enum ScaleType {
  Likert = "likert",
  YesNo = "binary",
  Agree3 = "agree3",
  Custom = "custom",
  Frequency = "frequency",
  Importance = "importance",
  Probability = "probability",
  Impact = "impact",
  RiskLevel = "risk_level",
  Psicossocial = "psicossocial",
  Numeric = "numeric"
}

// Export DiscFactorType from disc.ts
export { DiscFactorType } from './disc';

// Add AppRole type for auth
export type AppRole = 'superadmin' | 'admin' | 'evaluator' | 'user';

// Export User type from users
export type { User } from '../hooks/users/types';

// Export all types from subdirectories to make them available through @/types
export * from './assessment';
export * from './checklist';
export * from './disc';
export * from './scale';
export * from './settings';

// Add automation types
export type {
  AutomationRule,
  AutomationCondition,
  AutomationAction,
  EscalationLevel,
  ManagerNotification,
  AutomationLog
} from "./automation";
