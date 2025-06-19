
import { DiscFactorType, DiscQuestion } from "./disc";

// For Psicossocial, question is basic and grouped
export interface PsicossocialQuestion {
  id: string;
  text: string;
  category: string;
  weight?: number;
}

// Personal/Family Life Question
export interface PersonalLifeQuestion {
  id: string;
  text: string;
  category: string;
  weight?: number;
  isPrivate?: boolean;
}

// 360-degree evaluation question
export interface Evaluation360Question {
  id: string;
  text: string;
  category: string;
  evaluationType: "colleague" | "manager" | "subordinate";
  weight?: number;
}

export type ChecklistTemplateType = "disc" | "custom" | "psicossocial" | "srq20" | "phq9" | "gad7" | "mbi" | "audit" | "pss" | "copsoq" | "jcq" | "eri" | "personal_life" | "evaluation_360";

// Define ChecklistQuestion as a union type
export type ChecklistQuestion = DiscQuestion | PsicossocialQuestion | PersonalLifeQuestion | Evaluation360Question;

// Re-export types from disc and scale that are used with checklist
export type { DiscQuestion } from "./disc";
