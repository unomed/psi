
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, DiscQuestion, PsicossocialQuestion } from "@/types";
import { getSafeDbScaleType, getSafeDbTemplateType, formatQuestionsForDb } from "./templateUtils";

async function updateTemplateQuestions(
  templateId: string, 
  questions: (DiscQuestion | PsicossocialQuestion)[], 
  templateType: string
) {
  const { error: deleteError } = await supabase
    .from('questions')
    .delete()
    .eq('template_id', templateId);

  if (deleteError) {
    console.error("Error deleting existing questions:", deleteError);
    throw deleteError;
  }

  const questionsToInsert = formatQuestionsForDb(questions, templateId, templateType);

  const { error: insertError } = await supabase
    .from('questions')
    .insert(questionsToInsert);

  if (insertError) {
    console.error("Error inserting new questions:", insertError);
    throw insertError;
  }
}

export async function updateChecklistTemplate(
  templateId: string, 
  template: Partial<ChecklistTemplate>
): Promise<string> {
  const { companyId, createdAt, isStandard, questions, scaleType, type, ...otherProps } = template;
  
  const updateData: any = {
    ...otherProps,
    updated_at: new Date().toISOString()
  };
  
  if (scaleType) {
    updateData.scale_type = getSafeDbScaleType(scaleType);
  }
  
  if (isStandard !== undefined) {
    updateData.is_standard = isStandard;
  }
  
  if (companyId) {
    updateData.company_id = companyId;
  }
  
  if (type) {
    updateData.type = getSafeDbTemplateType(type);
  }

  const { data, error } = await supabase
    .from('checklist_templates')
    .update(updateData)
    .eq('id', templateId)
    .select()
    .single();

  if (error) {
    console.error("Error updating checklist template:", error);
    throw error;
  }

  if (questions) {
    await updateTemplateQuestions(templateId, questions, type || "disc");
  }

  return data.id;
}
