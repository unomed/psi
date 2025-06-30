
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, ChecklistResult } from "@/types";
import { mapDbTemplateTypeToApp } from "@/services/checklist/templateUtils";

export async function fetchAssessmentByToken(token: string) {
  try {
    console.log("[fetchAssessmentByToken] Buscando assessment com token:", token);
    
    const { data: linkData, error: linkError } = await supabase
      .from('assessment_links')
      .select(`
        *,
        checklist_templates (
          id,
          title,
          description,
          type,
          scale_type,
          cutoff_scores,
          created_at,
          updated_at
        )
      `)
      .eq('token', token)
      .single();

    if (linkError) {
      console.error("[fetchAssessmentByToken] Erro ao buscar link:", linkError);
      return { error: "Link de avaliação não encontrado ou expirado" };
    }

    if (!linkData || !linkData.checklist_templates) {
      console.error("[fetchAssessmentByToken] Link ou template não encontrado");
      return { error: "Template de avaliação não encontrado" };
    }

    // Verificar se o link não expirou
    if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
      console.error("[fetchAssessmentByToken] Link expirado");
      return { error: "Link de avaliação expirado" };
    }

    // Verificar se já foi usado
    if (linkData.used_at) {
      console.error("[fetchAssessmentByToken] Link já foi usado");
      return { error: "Este link de avaliação já foi utilizado" };
    }

    console.log("[fetchAssessmentByToken] Link válido encontrado:", linkData);

    // Buscar questões do template separadamente
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('template_id', linkData.checklist_templates.id)
      .order('order_number');

    if (questionsError) {
      console.error("[fetchAssessmentByToken] Erro ao buscar questões:", questionsError);
    }

    // Converter template para o formato esperado
    const template = {
      id: linkData.checklist_templates.id,
      title: linkData.checklist_templates.title,
      description: linkData.checklist_templates.description || "",
      type: linkData.checklist_templates.type,
      scale_type: linkData.checklist_templates.scale_type,
      questions: questions || [],
      cutoff_scores: linkData.checklist_templates.cutoff_scores || { high: 80, medium: 60, low: 40 },
      created_at: linkData.checklist_templates.created_at,
      updated_at: linkData.checklist_templates.updated_at,
      category: "custom" as const
    };

    return { 
      template,
      linkData: {
        id: linkData.id,
        employee_id: linkData.employee_id,
        created_by: linkData.created_by
      }
    };
  } catch (error) {
    console.error("[fetchAssessmentByToken] Erro inesperado:", error);
    return { error: "Erro interno do servidor" };
  }
}

export async function submitAssessmentResult(resultData: any) {
  try {
    console.log("[submitAssessmentResult] Enviando resultado:", resultData);

    const assessmentResponse = {
      template_id: resultData.templateId,
      employee_id: resultData.employeeId || null,
      employee_name: resultData.employeeName || "Anônimo",
      response_data: resultData.responses,
      raw_score: resultData.results?.totalScore || 0,
      dominant_factor: resultData.dominantFactor,
      factors_scores: resultData.results,
      notes: null,
      created_by: null
    };

    const { data, error } = await supabase
      .from('assessment_responses')
      .insert([assessmentResponse])
      .select()
      .single();

    if (error) {
      console.error("[submitAssessmentResult] Erro ao salvar:", error);
      throw error;
    }

    console.log("[submitAssessmentResult] Resultado salvo com sucesso:", data);
    return { result: data };
  } catch (error) {
    console.error("[submitAssessmentResult] Erro:", error);
    return { error: "Erro ao salvar resultado da avaliação" };
  }
}

export async function fetchAssessmentResults(): Promise<ChecklistResult[]> {
  try {
    const { data, error } = await supabase
      .from('assessment_responses')
      .select(`
        *,
        checklist_templates (
          title,
          type,
          description
        )
      `)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessment results:', error);
      throw error;
    }

    return (data || []).map(result => ({
      id: result.id,
      template_id: result.template_id,
      employee_id: result.employee_id,
      templateId: result.template_id,
      employeeId: result.employee_id,
      employeeName: result.employee_name,
      employee_name: result.employee_name,
      responses: result.response_data as Record<string, any>,
      results: result.factors_scores as Record<string, number>,
      dominantFactor: result.dominant_factor,
      dominant_factor: result.dominant_factor,
      score: result.raw_score,
      completedAt: new Date(result.completed_at),
      completed_at: result.completed_at,
      createdBy: result.created_by || ""
    }));
  } catch (error) {
    console.error('Error in fetchAssessmentResults:', error);
    throw error;
  }
}
