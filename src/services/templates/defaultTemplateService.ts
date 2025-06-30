
import { ChecklistTemplate } from "@/types";

// Placeholder for template data
const DEFAULT_PSICOSSOCIAL_TEMPLATE: Partial<ChecklistTemplate> = {
  title: "Avaliação Psicossocial Padrão",
  description: "Template padrão para avaliação de riscos psicossociais",
  type: "psicossocial",
  scale_type: "likert5",
  is_standard: true,
  questions: []
};

export function getDefaultTemplates(): ChecklistTemplate[] {
  return [];
}

export function createDefaultTemplate(type: string): Partial<ChecklistTemplate> {
  return DEFAULT_PSICOSSOCIAL_TEMPLATE;
}

export async function initializeDefaultTemplates(): Promise<void> {
  console.log("Initializing default templates...");
  // Implementation will be added when needed
}
