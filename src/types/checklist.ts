
import { DiscFactorType, DiscQuestion } from "./disc";
import { ScaleType } from "./index";

// For Psicossocial, question is basic and grouped
export interface PsicossocialQuestion {
  id: string;
  text: string;
  category: string;
  weight?: number;
}

export type ChecklistTemplateType = "disc" | "custom" | "psicossocial";

// Define ChecklistQuestion as a union type
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
  } | Record<string, number>; // Adicionando suporte para resultados categorizados
  dominantFactor: DiscFactorType | string; // Pode ser um fator DISC ou categoria psicossocial
  categorizedResults?: Record<string, number>; // Resultados agrupados por categoria
  completedAt: Date;
}

// Re-export types from disc and scale that are used with checklist
export type { DiscQuestion } from "./disc";
