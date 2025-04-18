
import { DiscFactorType, DiscQuestion } from "./disc";
import { ScaleType } from "./scale";

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
