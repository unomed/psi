
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, DiscQuestion, PsicossocialQuestion } from "@/types";
import { mapDbTemplateTypeToApp } from "@/services/checklist/templateUtils";

export async function submitAssessmentResult(resultData: Omit<any, "id" | "completedAt">) {
  try {
    const { data: result, error } = await supabase
      .from('assessment_responses')
      .insert({
        template_id: resultData.templateId,
        employee_id: resultData.employeeId,
        employee_name: resultData.employeeName,
        response_data: resultData.responses,
        factors_scores: resultData.factorsScores,
        dominant_factor: resultData.dominantFactor,
        notes: resultData.notes
      })
      .select()
      .single();

    if (error) {
      return { error: "Erro ao salvar resultado da avaliação", result: null };
    }

    if (resultData.linkId) {
      await supabase
        .from('assessment_links')
        .update({ used_at: new Date().toISOString() })
        .eq('id', resultData.linkId);
    }

    if (resultData.assessmentId) {
      await supabase
        .from('scheduled_assessments')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', resultData.assessmentId);
    }

    return { result, error: null };
  } catch (error) {
    console.error("Error submitting assessment result:", error);
    return { error: "Erro ao enviar resultado da avaliação", result: null };
  }
}

export async function fetchAssessmentByToken(token: string) {
  try {
    console.log("Buscando avaliação com token:", token);
    
    // Buscar link de avaliação pelo token
    const { data: linkData, error: linkError } = await supabase
      .from('assessment_links')
      .select(`
        id,
        employee_id,
        template_id,
        expires_at,
        used_at,
        checklist_templates (
          id,
          title,
          description,
          type,
          scale_type,
          instructions,
          company_id,
          created_at,
          updated_at,
          estimated_time_minutes,
          max_score,
          cutoff_scores,
          interpretation_guide,
          is_standard,
          is_active,
          version,
          created_by,
          derived_from_id
        )
      `)
      .eq('token', token)
      .single();

    if (linkError) {
      console.error("Erro ao buscar link:", linkError);
      return { error: "Link de avaliação não encontrado ou inválido" };
    }

    if (!linkData) {
      return { error: "Link de avaliação não encontrado" };
    }

    // Verificar se o link expirou
    if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
      return { error: "Link de avaliação expirado" };
    }

    // Verificar se já foi usado
    if (linkData.used_at) {
      return { error: "Este link de avaliação já foi utilizado" };
    }

    console.log("Link válido encontrado:", linkData);

    // Buscar as questões do template
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('template_id', linkData.checklist_templates.id)
      .order('order_number');

    if (questionsError) {
      console.error("Erro ao buscar questões:", questionsError);
    }

    // Mapear tipo do template
    const templateType = mapDbTemplateTypeToApp(linkData.checklist_templates.type);

    // Transformar questões do banco para o formato esperado
    let questions: (DiscQuestion | PsicossocialQuestion)[] = [];
    
    if (templateType === "disc") {
      questions = (questionsData || []).map(q => ({
        id: q.id,
        text: q.question_text,
        targetFactor: q.target_factor as any,
        weight: q.weight || 1
      }));
    } else if (templateType === "psicossocial") {
      questions = (questionsData || []).map(q => ({
        id: q.id,
        text: q.question_text,
        category: q.target_factor || "Geral"
      }));
    } else {
      // Para outros tipos, usar formato genérico como DiscQuestion
      questions = (questionsData || []).map(q => ({
        id: q.id,
        text: q.question_text,
        targetFactor: q.target_factor as any,
        weight: q.weight || 1
      })) as DiscQuestion[];
    }

    // Montar o template completo com as propriedades obrigatórias
    const template: ChecklistTemplate = {
      id: linkData.checklist_templates.id,
      title: linkData.checklist_templates.title,
      description: linkData.checklist_templates.description || "",
      type: templateType,
      questions,
      createdAt: new Date(linkData.checklist_templates.created_at),
      updatedAt: linkData.checklist_templates.updated_at ? new Date(linkData.checklist_templates.updated_at) : undefined,
      // Mapear propriedades do banco para interface
      scaleType: linkData.checklist_templates.scale_type as any,
      isStandard: linkData.checklist_templates.is_standard,
      companyId: linkData.checklist_templates.company_id,
      derivedFromId: linkData.checklist_templates.derived_from_id,
      estimatedTimeMinutes: linkData.checklist_templates.estimated_time_minutes,
      maxScore: linkData.checklist_templates.max_score,
      cutoffScores: linkData.checklist_templates.cutoff_scores,
      interpretationGuide: linkData.checklist_templates.interpretation_guide,
      isActive: linkData.checklist_templates.is_active,
      version: linkData.checklist_templates.version,
      createdBy: linkData.checklist_templates.created_by,
      instructions: linkData.checklist_templates.instructions
    };

    return {
      template,
      assessmentId: linkData.id,
      linkId: linkData.id,
      error: null
    };
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    return { error: "Erro interno ao buscar avaliação" };
  }
}
