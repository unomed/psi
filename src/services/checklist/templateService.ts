
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, DiscQuestion, PsicossocialQuestion, ScaleType } from "@/types";
import { scaleTypeToDbScaleType, dbScaleTypeToScaleType } from "@/types/scale";
import { DbTemplateType } from "./types";
import { mapAppTemplateTypeToDb, mapDbTemplateTypeToApp } from "./utils";

export async function fetchChecklistTemplates(): Promise<ChecklistTemplate[]> {
  const { data, error } = await supabase
    .from('checklist_templates')
    .select('*, questions(*)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching checklist templates:", error);
    throw error;
  }

  return (data || []).map(template => {
    const templateType = mapDbTemplateTypeToApp(template.type);
    
    let questions: (DiscQuestion | PsicossocialQuestion)[] = [];
    
    if (templateType === "disc") {
      questions = (template.questions || []).map(q => ({
        id: q.id,
        text: q.question_text,
        targetFactor: q.target_factor as any,
        weight: q.weight || 1
      }));
    } else if (templateType === "psicossocial") {
      questions = (template.questions || []).map(q => ({
        id: q.id,
        text: q.question_text,
        category: q.target_factor || "Geral"
      }));
    } else {
      questions = (template.questions || []).map(q => ({
        id: q.id,
        text: q.question_text,
        targetFactor: q.target_factor as any,
        weight: q.weight || 1
      })) as DiscQuestion[];
    }

    return {
      id: template.id,
      title: template.title,
      description: template.description || "",
      type: templateType,
      scaleType: dbScaleTypeToScaleType(template.scale_type), // Convert DB scale type to app scale type
      isStandard: template.is_standard || false,
      companyId: template.company_id,
      derivedFromId: template.derived_from_id,
      questions,
      createdAt: new Date(template.created_at)
    };
  });
}

export async function saveChecklistTemplate(
  template: Omit<ChecklistTemplate, "id" | "createdAt">, 
  isStandard: boolean = false
): Promise<string> {
  const dbScaleType = scaleTypeToDbScaleType(template.scaleType || ScaleType.Likert);
  const dbTemplateType = mapAppTemplateTypeToDb(template.type);
  
  // Make sure to use the correct column names that match the Supabase database schema
  const { data: templateData, error: templateError } = await supabase
    .from('checklist_templates')
    .insert({
      title: template.title,
      description: template.description,
      type: dbTemplateType,
      scale_type: dbScaleType,
      is_active: true,
      is_standard: isStandard,
      company_id: template.companyId
    })
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

  const questionsToInsert = template.questions.map((q, index) => {
    if (template.type === "disc") {
      const discQuestion = q as DiscQuestion;
      return {
        template_id: templateId,
        question_text: discQuestion.text,
        order_number: index + 1,
        target_factor: discQuestion.targetFactor,
        weight: discQuestion.weight
      };
    } else if (template.type === "psicossocial") {
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

  const { error: questionsError } = await supabase
    .from('questions')
    .insert(questionsToInsert);

  if (questionsError) {
    console.error("Error creating checklist questions:", questionsError);
    throw questionsError;
  }

  return templateId;
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
    updateData.scale_type = scaleTypeToDbScaleType(scaleType);
  }
  
  if (isStandard !== undefined) {
    updateData.is_standard = isStandard;
  }
  
  if (companyId) {
    updateData.company_id = companyId;
  }
  
  if (type) {
    updateData.type = mapAppTemplateTypeToDb(type);
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

  const questionsToInsert = questions.map((q, index) => {
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

  const { error: insertError } = await supabase
    .from('questions')
    .insert(questionsToInsert);

  if (insertError) {
    console.error("Error inserting new questions:", insertError);
    throw insertError;
  }
}

export async function deleteChecklistTemplate(templateId: string): Promise<void> {
  const { error: questionsDeleteError } = await supabase
    .from('questions')
    .delete()
    .eq('template_id', templateId);

  if (questionsDeleteError) {
    console.error("Error deleting template questions:", questionsDeleteError);
    throw questionsDeleteError;
  }

  const { error: templateDeleteError } = await supabase
    .from('checklist_templates')
    .delete()
    .eq('id', templateId);

  if (templateDeleteError) {
    console.error("Error deleting checklist template:", templateDeleteError);
    throw templateDeleteError;
  }
}
