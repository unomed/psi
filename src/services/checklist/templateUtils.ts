
import { ChecklistTemplateType } from "@/types/checklist";

export function mapDbTemplateTypeToApp(dbType: string): ChecklistTemplateType {
  // Mapeamento direto dos tipos do banco para os tipos da aplicação
  switch (dbType) {
    case "disc":
      return "disc";
    case "psicossocial":
      return "psicossocial";
    case "srq20":
      return "srq20";
    case "phq9":
      return "phq9";
    case "gad7":
      return "gad7";
    case "mbi":
      return "mbi";
    case "audit":
      return "audit";
    case "pss":
      return "pss";
    case "copsoq":
      return "copsoq";
    case "jcq":
      return "jcq";
    case "eri":
      return "eri";
    case "custom":
    default:
      return "custom";
  }
}

export function mapAppTemplateTypeToDb(appType: ChecklistTemplateType): string {
  // Mapeamento inverso
  return appType;
}

export function isTemplateTypePsicossocial(template: { type: ChecklistTemplateType; title?: string }): boolean {
  // Verifica se é um template psicossocial baseado no tipo ou título
  return template.type === "psicossocial" || 
         (template.type === "custom" && 
          template.title && 
          template.title.toLowerCase().includes("psicossocial"));
}

export function getTemplateTypeDisplayName(template: { type: ChecklistTemplateType; title?: string }): string {
  if (template.type === "disc") return "DISC";
  if (template.type === "psicossocial") return "Psicossocial";
  if (isTemplateTypePsicossocial(template)) return "Psicossocial";
  if (template.type === "srq20") return "SRQ-20";
  if (template.type === "phq9") return "PHQ-9";
  if (template.type === "gad7") return "GAD-7";
  if (template.type === "mbi") return "MBI";
  if (template.type === "audit") return "AUDIT";
  if (template.type === "pss") return "PSS";
  if (template.type === "copsoq") return "COPSOQ";
  if (template.type === "jcq") return "JCQ";
  if (template.type === "eri") return "ERI";
  return "Personalizado";
}
