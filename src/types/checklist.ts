
import { DiscFactorType, DiscQuestion } from "./disc";
import { ScaleType } from "./index";

// For Psicossocial, question is basic and grouped
export interface PsicossocialQuestion {
  id: string;
  text: string;
  category: string;
}

export type ChecklistTemplateType = "disc" | "custom" | "psicossocial";

export type ChecklistQuestion = DiscQuestion | PsicossocialQuestion;

// For disc + custom: DiscQuestion[]; for psicossocial: PsicossocialQuestion[]
export interface ChecklistTemplate {
  id: string;
  title: string;
  description: string;
  type: ChecklistTemplateType;
  questions: ChecklistQuestion[];
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

// Re-export types from disc and scale that are used with checklist
export type { DiscQuestion } from "./disc";
