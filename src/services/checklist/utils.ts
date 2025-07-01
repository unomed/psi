
import { ChecklistTemplateType } from "@/types/checklist";
import { DiscFactorType } from "@/types/disc";
import { DbTemplateType } from "./types";

export function mapAppTemplateTypeToDb(type: ChecklistTemplateType): DbTemplateType {
  switch (type) {
    case "disc":
      return "disc";
    case "psicossocial":
      return "psicossocial";
    case "custom":
      return "custom";
    default:
      return "custom";
  }
}

export function mapDbTemplateTypeToApp(dbType: DbTemplateType): ChecklistTemplateType {
  switch (dbType) {
    case "disc":
      return "disc";
    case "psicossocial":
      return "psicossocial";
    case "custom":
      return "custom";
    default:
      return "custom";
  }
}

// Add the missing function for converting string to DiscFactorType
export function stringToDiscFactorType(factorString: string): DiscFactorType {
  switch (factorString.toUpperCase()) {
    case "D":
      return DiscFactorType.D;
    case "I":
      return DiscFactorType.I;
    case "S":
      return DiscFactorType.S;
    case "C":
      return DiscFactorType.C;
    default:
      return DiscFactorType.D; // Default to Dominance if unknown
  }
}
