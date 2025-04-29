
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
      scaleType: dbScaleTypeToScaleType(template.scale_type), 
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
  
  // Using type assertion for accepted Supabase scale types
  // These must match the enum values in the database
  const validDbScaleTypes = ["likert5", "likert7", "binary", "range10", "frequency", "stanine", "percentile", "tscore", "custom"] as const;
  type SupabaseScaleType = typeof validDbScaleTypes[number];
  
  // Handle the case where our scaleType returns "numeric" which isn't in Supabase's enum
  let safeDbScaleType: SupabaseScaleType = "custom";
  if (validDbScaleTypes.includes(dbScaleType as any)) {
    safeDbScaleType = dbScaleType as SupabaseScaleType;
  }
  
  // Define valid template types for Supabase
  const validDbTemplateTypes = ["custom", "srq20", "phq9", "gad7", "mbi", "audit", "pss", "copsoq", "jcq", "eri", "disc"] as const;
  type SupabaseTemplateType = typeof validDbTemplateTypes[number];
  
  // Handle the case where our template type isn't in Supabase's enum
  let safeDbTemplateType: SupabaseTemplateType = "custom";
  if (validDbTemplateTypes.includes(dbTemplateType as any)) {
    safeDbTemplateType = dbTemplateType as SupabaseTemplateType;
  }
  
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
    const dbScaleType = scaleTypeToDbScaleType(scaleType);
    
    // Same approach as in saveChecklistTemplate
    const validDbScaleTypes = ["likert5", "likert7", "binary", "range10", "frequency", "stanine", "percentile", "tscore", "custom"] as const;
    type SupabaseScaleType = typeof validDbScaleTypes[number];
    
    let safeDbScaleType: SupabaseScaleType = "custom";
    if (validDbScaleTypes.includes(dbScaleType as any)) {
      safeDbScaleType = dbScaleType as SupabaseScaleType;
    }
    
    updateData.scale_type = safeDbScaleType;
  }
  
  if (isStandard !== undefined) {
    updateData.is_standard = isStandard;
  }
  
  if (companyId) {
    updateData.company_id = companyId;
  }
  
  if (type) {
    const dbTemplateType = mapAppTemplateTypeToDb(type);
    
    // Same approach as in saveChecklistTemplate
    const validDbTemplateTypes = ["custom", "srq20", "phq9", "gad7", "mbi", "audit", "pss", "copsoq", "jcq", "eri", "disc"] as const;
    type SupabaseTemplateType = typeof validDbTemplateTypes[number];
    
    let safeDbTemplateType: SupabaseTemplateType = "custom";
    if (validDbTemplateTypes.includes(dbTemplateType as any)) {
      safeDbTemplateType = dbTemplateType as SupabaseTemplateType;
    }
    
    updateData.type = safeDbTemplateType;
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
