
export type RoleType = "admin" | "employee" | "superadmin";

// Define RecurrenceType as a string type and enum for compatibility
export type RecurrenceType = "none" | "monthly" | "semiannual" | "annual";
export enum RecurrenceType {
  None = "none",
  Monthly = "monthly",
  Semiannual = "semiannual",
  Annual = "annual"
}

// Scale type definitions
export enum ScaleType {
  Likert = "likert",
  YesNo = "yesno",
  Agree3 = "agree3",
  Custom = "custom",
  Frequency = "frequency",
  Importance = "importance",
  Probability = "probability",
  Impact = "impact",
  RiskLevel = "risk_level",
}

export function scaleTypeToDbScaleType(scaleType: ScaleType): string {
  switch (scaleType) {
    case ScaleType.Likert:
      return "likert5";
    case ScaleType.YesNo:
      return "binary";
    case ScaleType.Agree3:
      return "agree3";
    case ScaleType.Custom:
      return "custom";
    case ScaleType.Frequency:
      return "frequency";
    case ScaleType.Importance:
      return "importance";
    case ScaleType.Probability:
      return "probability";
    case ScaleType.Impact:
      return "impact";
    case ScaleType.RiskLevel:
      return "risk_level";
    default:
      return "likert5"; // Default to likert if the scale type is not recognized
  }
}

// DISC types - make this an enum for better type compatibility
export enum DiscFactorType {
  D = "D",
  I = "I",
  S = "S",
  C = "C",
}

// Add AppRole type for auth
export type AppRole = 'superadmin' | 'admin' | 'evaluator' | 'user';

// Export all types from subdirectories to make them available through @/types
export * from './assessment';
export * from './checklist';
export * from './disc';
export * from './scale';
