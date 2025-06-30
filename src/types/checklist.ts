
import { ChecklistTemplate, ChecklistQuestion, PsicossocialQuestion, DiscQuestion } from './index';

export interface ChecklistResult {
  id: string;
  template_id: string;
  employee_id: string;
  employee_name?: string;
  responses: Record<string, any>;
  results: Record<string, number>;
  dominant_factor?: string;
  raw_score?: number;
  normalized_score?: number;
  percentile?: number;
  stanine?: number;
  tscore?: number;
  classification?: string;
  factors_scores?: Record<string, number>;
  categorized_results?: Record<string, number>;
  completed_at?: string;
  created_by?: string;
  notes?: string;
}

export interface ChecklistResponse {
  templateId: string;
  employeeName: string;
  responses: Record<string, string | number>;
  results: Record<string, number>;
  dominantFactor: string;
  categorizedResults: Record<string, number>;
  factorsScores: Record<string, number>;
}

export {
  ChecklistTemplate,
  ChecklistQuestion,
  PsicossocialQuestion,
  DiscQuestion
};
