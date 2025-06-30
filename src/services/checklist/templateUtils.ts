
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

export function isTemplateTypePsicossocial(template: ChecklistTemplate): boolean {
  return template.type === "psicossocial" || template.category === "psicossocial";
}

export function getTemplateTypeDisplayName(template: ChecklistTemplate): string {
  switch (template.type) {
    case "disc":
      return "DISC";
    case "psicossocial":
      return "Psicossocial";
    case "evaluation_360":
      return "Avaliação 360°";
    default:
      return "Personalizado";
  }
}

export function get360Questions(type: "colleague" | "manager"): any[] {
  if (type === "colleague") {
    return [
      { text: "Demonstra colaboração efetiva", category: "teamwork" },
      { text: "Comunica-se de forma clara", category: "communication" },
      { text: "Mantém relacionamento profissional", category: "relationship" },
    ];
  }
  return [
    { text: "Oferece feedback construtivo", category: "leadership" },
    { text: "Está disponível quando necessário", category: "availability" },
    { text: "Reconhece bom desempenho", category: "recognition" },
  ];
}

export function getSafeDbScaleType(scaleType: string): string {
  return scaleType;
}

export function getSafeDbTemplateType(templateType: string): string {
  return templateType;
}

export function formatQuestionsForDb(questions: any[], templateId: string, templateType: string): any[] {
  return questions.map((q, index) => ({
    ...q,
    template_id: templateId,
    order_number: index + 1
  }));
}

export function mapDbTemplateTypeToApp(dbType: string): string {
  return dbType;
}
