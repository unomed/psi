
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
    // Get link data from database
    const { data: linkData, error: linkError } = await supabase
      .from('assessment_links')
      .select('*')
      .eq('token', token)
      .single();

    if (linkError) {
      console.error("Link error:", linkError);
      if (linkError.code === 'PGRST116') {
        return { error: "Link de avaliação não encontrado ou expirado", template: null, assessmentId: null };
      }
      throw linkError;
    }

    // Check if link is expired
    if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
      return { error: "Link de avaliação expirado", template: null, assessmentId: null };
    }

    // Check if link has already been used
    if (linkData.used_at) {
      return { error: "Link de avaliação já foi utilizado", template: null, assessmentId: null };
    }

    // Get template data
    const { data: template, error: templateError } = await supabase
      .from('checklist_templates')
      .select('*')
      .eq('id', linkData.template_id)
      .single();

    if (templateError) {
      console.error("Template error:", templateError);
      return { error: "Modelo de avaliação não encontrado", template: null, assessmentId: null };
    }

    console.log("Template fetched:", template);

    // Get assessment ID if available
    const { data: assessmentData } = await supabase
      .from('scheduled_assessments')
      .select('id')
      .eq('template_id', linkData.template_id)
      .eq('employee_id', linkData.employee_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return { 
      template, 
      error: null, 
      assessmentId: assessmentData?.id || null,
      linkId: linkData.id
    };
  } catch (error) {
    console.error("Error fetching assessment by token:", error);
    return { error: "Erro ao buscar avaliação", template: null, assessmentId: null };
  }
}
