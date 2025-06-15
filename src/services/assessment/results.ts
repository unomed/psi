import { supabase } from "@/integrations/supabase/client";

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
          company_id
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

    return {
      template: linkData.checklist_templates,
      assessmentId: linkData.id,
      linkId: linkData.id,
      error: null
    };
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    return { error: "Erro interno ao buscar avaliação" };
  }
}
