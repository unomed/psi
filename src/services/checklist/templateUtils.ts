
import { ChecklistTemplate } from "@/types";

export function validateTemplate(template: Partial<ChecklistTemplate>): boolean {
  return !!(template.title && template.questions && template.questions.length > 0);
}

export function getTemplateDefaults(): Partial<ChecklistTemplate> {
  return {
    scale_type: "likert5",
    is_standard: false,
    is_active: true,
    version: 1,
    estimated_time_minutes: 15,
    cutoff_scores: { high: 80, medium: 60, low: 40 }
  };
}
