
import { DiscFactorType } from "@/types/disc";
import { ChecklistTemplateType } from "@/types/checklist";
import { DbTemplateType } from "./types";

export function mapAppTemplateTypeToDb(type: ChecklistTemplateType): DbTemplateType {
  if (type === "psicossocial") {
    return "custom";
  }
  return type as DbTemplateType;
}

export function mapDbTemplateTypeToApp(type: string): ChecklistTemplateType {
  if (["copsoq", "jcq", "eri"].includes(type)) {
    return "psicossocial";
  }
  return type as ChecklistTemplateType;
}

export function stringToDiscFactorType(factor: string): DiscFactorType {
  switch (factor) {
    case "D": return DiscFactorType.D;
    case "I": return DiscFactorType.I;
    case "S": return DiscFactorType.S;
    case "C": return DiscFactorType.C;
    default: return DiscFactorType.D;
  }
}
