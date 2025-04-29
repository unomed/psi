
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplateType } from "@/types/checklist";
import { DbTemplateType } from "./types";
import { DiscQuestion, PsicossocialQuestion, ScaleType } from "@/types";
import { dbScaleTypeToScaleType, scaleTypeToDbScaleType } from "@/types/scale";

// Define valid Supabase scale types
export const validDbScaleTypes = ["likert5", "likert7", "binary", "range10", "frequency", "stanine", "percentile", "tscore", "custom"] as const;
export type SupabaseScaleType = typeof validDbScaleTypes[number];

// Define valid Supabase template types
export const validDbTemplateTypes = ["custom", "srq20", "phq9", "gad7", "mbi", "audit", "pss", "copsoq", "jcq", "eri", "disc", "psicossocial"] as const;
export type SupabaseTemplateType = typeof validDbTemplateTypes[number];

// Get a safe scale type for Supabase
export function getSafeDbScaleType(scaleType: ScaleType): SupabaseScaleType {
  const dbScaleType = scaleTypeToDbScaleType(scaleType);
  let safeDbScaleType: SupabaseScaleType = "custom";
  
  if (validDbScaleTypes.includes(dbScaleType as any)) {
    safeDbScaleType = dbScaleType as SupabaseScaleType;
  }
  
  return safeDbScaleType;
}

// Get a safe template type for Supabase
export function getSafeDbTemplateType(templateType: ChecklistTemplateType): SupabaseTemplateType {
  const dbTemplateType = mapAppTemplateTypeToDb(templateType);
  let safeDbTemplateType: SupabaseTemplateType = "custom";
  
  if (validDbTemplateTypes.includes(dbTemplateType as any)) {
    safeDbTemplateType = dbTemplateType as SupabaseTemplateType;
  }
  
  return safeDbTemplateType;
}

// Format questions for database insertion based on template type
export function formatQuestionsForDb(
  questions: (DiscQuestion | PsicossocialQuestion)[], 
  templateId: string, 
  templateType: string
) {
  return questions.map((q, index) => {
    if (templateType === "disc") {
      const discQuestion = q as DiscQuestion;
      return {
        template_id: templateId,
        question_text: discQuestion.text,
        order_number: index + 1,
        target_factor: discQuestion.targetFactor,
        weight: discQuestion.weight
      };
    } else if (templateType === "psicossocial") {
      const psiQuestion = q as PsicossocialQuestion;
      return {
        template_id: templateId,
        question_text: psiQuestion.text,
        order_number: index + 1,
        target_factor: psiQuestion.category,
        weight: 1
      };
    } else {
      return {
        template_id: templateId,
        question_text: q.text,
        order_number: index + 1,
        target_factor: (q as any).targetFactor || null,
        weight: (q as any).weight || 1
      };
    }
  });
}

// Map app template types to database template types
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

// Map database template types to app template types
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
