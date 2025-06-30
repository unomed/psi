import { DiscFactorType } from './disc';

export interface ChecklistQuestion {
  id: string;
  template_id: string;
  question_text: string;
  text: string;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  scale_type: string;
  is_standard: boolean;
  is_active: boolean;
  estimated_time_minutes: number;
  version: number;
  created_at: string;
  updated_at: string;
  createdAt: Date;
  company_id?: string;
  created_by?: string;
  cutoff_scores: { high: number; medium: number; low: number; };
  derived_from_id?: string;
  instructions?: string;
  type?: string;
  questions: ChecklistQuestion[];
}

export interface ChecklistResult {
  id: string;
  template_id: string;
  employee_id: string;
  templateId: string;
  employeeId: string;
  employeeName: string;
  employee_name: string;
  responses: Record<string, any>;
  results: Record<string, number>;
  dominantFactor?: DiscFactorType;
  dominant_factor?: string;
  score: number;
  completedAt: Date;
  completed_at: string;
  createdBy: string;
}

export type { ChecklistTemplate } from './templates';
export type { ChecklistResult } from './results';
export type { ChecklistQuestion } from './questions';
export type { ScaleType } from './scale';
