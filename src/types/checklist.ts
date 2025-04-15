export type DiscFactorType = "D" | "I" | "S" | "C";

export interface DiscFactor {
  type: DiscFactorType;
  name: string;
  description: string;
}

export interface DiscQuestion {
  id: string;
  text: string;
  targetFactor: DiscFactorType;
  weight: number;
}

// Application-specific scale types 
export type ScaleType = "likert5" | "yesno" | "agree3" | "custom";

// Database scale types (from Supabase)
export type DbScaleType = "likert5" | "likert7" | "binary" | "range10" | "frequency" | "stanine" | "percentile" | "tscore" | "custom";

// Mapping between app scale types and DB scale types
export const scaleTypeToDbScaleType = (scaleType: ScaleType): DbScaleType => {
  switch (scaleType) {
    case "likert5": return "likert5";
    case "yesno": return "binary";
    case "agree3": return "custom";
    case "custom": return "custom";
    default: return "likert5";
  }
};

export interface ChecklistTemplate {
  id: string;
  title: string;
  description: string;
  type: "disc" | "custom";
  questions: DiscQuestion[];
  createdAt: Date;
  scaleType?: ScaleType;
  isStandard?: boolean;
  companyId?: string | null;
  derivedFromId?: string | null;
}

export interface ChecklistResult {
  id: string;
  templateId: string;
  employeeId?: string;
  employeeName?: string;
  results: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  dominantFactor: DiscFactorType;
  completedAt: Date;
}

export type AssessmentStatus = "scheduled" | "sent" | "completed";
export type RecurrenceType = "none" | "monthly" | "semiannual" | "annual";

export interface ScheduledAssessment {
  id: string;
  employeeId: string;
  templateId: string;
  scheduledDate: Date;
  sentAt: Date | null;
  linkUrl: string;
  status: AssessmentStatus;
  completedAt: Date | null;
  recurrenceType?: RecurrenceType;
  nextScheduledDate?: Date | null;
  phoneNumber?: string;
}
