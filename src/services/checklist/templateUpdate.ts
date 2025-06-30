
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, ChecklistQuestion } from "@/types";
import { createTemplateQuestions, updateTemplateQuestions } from "./templateQuestions";
import { getSafeDbScaleType, getSafeDbTemplateType, formatQuestionsForDb } from "./templateUtils";

export interface UpdateTemplateData {
  title?: string;
  description?: string;
  type?: string;
  scaleType?: string;
  instructions?: string;
  questions?: ChecklistQuestion[];
  cutoffScores?: { high: number; medium: number; low: number };
  estimatedTimeMinutes?: number;
  isActive?: boolean;
  companyId?: string;
  isStandard?: boolean;
}

export async function updateTemplate(
  id: string, 
  templateData: UpdateTemplateData
): Promise<ChecklistTemplate> {
  try {
    console.log('Updating template:', id, templateData);

    // Prepare data for database update
    const dbUpdateData: any = {};
    
    if (templateData.title) dbUpdateData.title = templateData.title;
    if (templateData.description) dbUpdateData.description = templateData.description;
    if (templateData.type) dbUpdateData.type = getSafeDbTemplateType(templateData.type);
    if (templateData.scaleType) dbUpdateData.scale_type = getSafeDbScaleType(templateData.scaleType);
    if (templateData.instructions) dbUpdateData.instructions = templateData.instructions;
    if (templateData.cutoffScores) dbUpdateData.cutoff_scores = templateData.cutoffScores;
    if (templateData.estimatedTimeMinutes) dbUpdateData.estimated_time_minutes = templateData.estimatedTimeMinutes;
    if (templateData.isActive !== undefined) dbUpdateData.is_active = templateData.isActive;
    if (templateData.companyId) dbUpdateData.company_id = templateData.companyId;
    if (templateData.isStandard !== undefined) dbUpdateData.is_standard = templateData.isStandard;

    dbUpdateData.updated_at = new Date().toISOString();

    // Update template in database
    const { data: templateResult, error: templateError } = await supabase
      .from('checklist_templates')
      .update(dbUpdateData)
      .eq('id', id)
      .select(`
        *,
        questions!inner(*)
      `)
      .single();

    if (templateError) {
      console.error('Error updating template:', templateError);
      throw templateError;
    }

    // Update questions if provided
    if (templateData.questions) {
      const formattedQuestions = formatQuestionsForDb(
        templateData.questions, 
        id, 
        templateData.type || 'custom'
      );
      await updateTemplateQuestions(id, formattedQuestions);
    }

    // Fetch updated template with questions
    const { data: finalTemplate, error: fetchError } = await supabase
      .from('checklist_templates')
      .select(`
        *,
        questions(*)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching updated template:', fetchError);
      throw fetchError;
    }

    // Convert to app format
    const result: ChecklistTemplate = {
      id: finalTemplate.id,
      title: finalTemplate.title,
      name: finalTemplate.title,
      description: finalTemplate.description || '',
      category: finalTemplate.type as any,
      scale_type: finalTemplate.scale_type as any,
      is_standard: finalTemplate.is_standard || false,
      is_active: finalTemplate.is_active,
      estimated_time_minutes: finalTemplate.estimated_time_minutes || 15,
      version: finalTemplate.version || 1,
      created_at: finalTemplate.created_at,
      updated_at: finalTemplate.updated_at,
      createdAt: new Date(finalTemplate.created_at),
      company_id: finalTemplate.company_id,
      created_by: finalTemplate.created_by,
      cutoff_scores: typeof finalTemplate.cutoff_scores === 'object' && finalTemplate.cutoff_scores !== null
        ? finalTemplate.cutoff_scores as { high: number; medium: number; low: number }
        : { high: 80, medium: 60, low: 40 },
      derived_from_id: finalTemplate.derived_from_id,
      instructions: finalTemplate.instructions,
      type: finalTemplate.type,
      questions: (finalTemplate.questions || []).map((q: any) => ({
        id: q.id,
        template_id: q.template_id,
        question_text: q.question_text,
        text: q.question_text,
        order_number: q.order_number,
        created_at: q.created_at,
        updated_at: q.updated_at || q.created_at
      }))
    };

    console.log('Template updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in updateTemplate:', error);
    throw error;
  }
}
