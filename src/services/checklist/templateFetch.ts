
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, DiscQuestion, PsicossocialQuestion } from "@/types";
import { dbScaleTypeToScaleType } from "@/types/scale";
import { mapDbTemplateTypeToApp } from "./templateUtils";

export async function fetchChecklistTemplates(): Promise<ChecklistTemplate[]> {
  const { data, error } = await supabase
    .from('checklist_templates')
    .select('*, questions(*)')
    .eq('is_active', true)
    .order('is_standard', { ascending: false })
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
      createdAt: new Date(template.created_at),
      estimatedTimeMinutes: template.estimated_time_minutes,
      instructions: template.instructions,
      interpretationGuide: template.interpretation_guide,
      maxScore: template.max_score,
      cutoffScores: template.cutoff_scores,
      isActive: template.is_active,
      version: template.version,
      updatedAt: template.updated_at ? new Date(template.updated_at) : undefined,
      createdBy: template.created_by
    };
  });
}
