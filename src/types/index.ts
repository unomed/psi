
export type RoleType = "admin" | "employee" | "superadmin";

// Define RecurrenceType as an enum and string type for compatibility
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
  Frequency = "frequency",
  Importance = "importance",
  Probability = "probability",
  Impact = "impact",
  RiskLevel = "risk_level",
}

export function scaleTypeToDbScaleType(scaleType: ScaleType): string {
  switch (scaleType) {
    case ScaleType.Likert:
      return "likert";
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
      return "likert"; // Default to likert if the scale type is not recognized
  }
}

// DISC types
export enum DiscFactorType {
  D = "D",
  I = "I",
  S = "S",
  C = "C",
}

// Export all types from subdirectories to make them available through @/types
export * from './assessment';
export * from './checklist';
export * from './disc';
export * from './scale';
