
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

export type ScaleType = "likert5" | "yesno" | "agree3" | "custom";

export interface ChecklistTemplate {
  id: string;
  title: string;
  description: string;
  type: "disc" | "custom";
  questions: DiscQuestion[];
  createdAt: Date;
  scaleType?: ScaleType; // Novo campo para o tipo de escala
}

export interface ChecklistResult {
  id: string;
  templateId: string;
  employeeId?: string;
  employeeName?: string; // For demonstration purposes
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
