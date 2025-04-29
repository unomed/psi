
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, ScaleType } from "@/types";
import { getSafeDbScaleType, getSafeDbTemplateType, formatQuestionsForDb } from "./templateUtils";

export async function saveChecklistTemplate(
  template: Omit<ChecklistTemplate, "id" | "createdAt">, 
  isStandard: boolean = false
): Promise<string> {
  const safeDbScaleType = getSafeDbScaleType(template.scaleType || ScaleType.Likert);
  const safeDbTemplateType = getSafeDbTemplateType(template.type);
  
  // Create templateInsert object with safely typed properties
  const templateInsert = {
    title: template.title,
    description: template.description,
    type: safeDbTemplateType,
    scale_type: safeDbScaleType,
    is_active: true,
    is_standard: isStandard,
    company_id: template.companyId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: templateData, error: templateError } = await supabase
    .from('checklist_templates')
    .insert(templateInsert)
    .select()
    .single();

  if (templateError) {
    console.error("Error creating checklist template:", templateError);
    throw templateError;
  }

  const templateId = templateData?.id;
  if (!templateId) {
    throw new Error("Failed to get template ID after insertion");
  }

  const questionsToInsert = formatQuestionsForDb(template.questions, templateId, template.type);

  const { error: questionsError } = await supabase
    .from('questions')
    .insert(questionsToInsert);

  if (questionsError) {
    console.error("Error creating checklist questions:", questionsError);
    throw questionsError;
  }

  return templateId;
}
