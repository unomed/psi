
import { DiscFactorType, DiscQuestion } from "./disc";
import { ScaleType } from "./index";

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

// Updated ChecklistTemplate interface to match database schema
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
  // Additional properties for 360 evaluations
  targetRole?: string; // Para avaliações 360°
  isAnonymous?: boolean; // Para avaliações 360°
  restrictToSector?: boolean; // Para limitar avaliações por setor
  // Additional properties from database
  estimatedTimeMinutes?: number;
  instructions?: string;
  interpretationGuide?: string;
  maxScore?: number;
  cutoffScores?: any;
  isActive?: boolean;
  version?: number;
  updatedAt?: Date;
  createdBy?: string;
  // Database field names for compatibility
  estimated_time_minutes?: number;
  is_standard?: boolean;
  company_id?: string | null;
  derived_from_id?: string | null;
  scale_type?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  is_active?: boolean;
  cutoff_scores?: any;
  max_score?: number;
  interpretation_guide?: string;
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
  // Para avaliações 360°
  evaluatedEmployeeId?: string;
  evaluatorEmployeeId?: string;
  isAnonymous?: boolean;
  // Para cruzamento de dados pessoais
  personalFactors?: Record<string, any>;
  riskCorrelation?: "work" | "personal" | "mixed" | "unknown";
}

// Re-export types from disc and scale that are used with checklist
export type { DiscQuestion } from "./disc";
