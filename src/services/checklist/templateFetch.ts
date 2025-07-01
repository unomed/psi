
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, DiscQuestion, PsicossocialQuestion } from "@/types";
import { dbScaleTypeToScaleType } from "@/types/scale";
import { mapDbTemplateTypeToApp } from "./templateUtils";

export async function fetchChecklistTemplates(): Promise<ChecklistTemplate[]> {
  console.log("Buscando templates de checklist...");
  
  const { data, error } = await supabase
    .from('checklist_templates')
    .select('*, questions(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching checklist templates:", error);
    throw error;
  }

  console.log("Templates encontrados:", data?.length || 0);
  
  return (data || []).map(template => {
    console.log(`Processando template: ${template.title} (${template.type})`);
    console.log(`Perguntas no template: ${template.questions?.length || 0}`);
    
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
        category: q.target_factor || "geral",
        weight: q.weight || 1
      }));
    } else {
      // Para outros tipos, usar formato DISC como fallback
      questions = (template.questions || []).map(q => ({
        id: q.id,
        text: q.question_text,
        targetFactor: q.target_factor as any,
        weight: q.weight || 1
      })) as DiscQuestion[];
    }

    const mappedTemplate = {
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
      estimatedTimeMinutes: template.estimated_time_minutes
    };

    console.log(`Template mapeado: ${mappedTemplate.title} com ${mappedTemplate.questions.length} perguntas`);
    return mappedTemplate;
  });
}
