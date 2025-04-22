
import { ChecklistTemplateType } from "@/types/checklist";
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
