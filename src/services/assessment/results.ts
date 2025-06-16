
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
    console.log("=== FETCH ASSESSMENT BY TOKEN - INÍCIO ===");
    console.log("Token recebido:", token);
    
    // PASSO 1: Buscar link de avaliação pelo token (query simplificada)
    console.log("Passo 1: Buscando link de avaliação...");
    const { data: linkData, error: linkError } = await supabase
      .from('assessment_links')
      .select('id, employee_id, template_id, expires_at, used_at')
      .eq('token', token)
      .maybeSingle();

    if (linkError) {
      console.error("Erro ao buscar link:", linkError);
      return { error: "Link de avaliação não encontrado ou inválido" };
    }

    if (!linkData) {
      console.log("Link não encontrado para token:", token);
      return { error: "Link de avaliação não encontrado" };
    }

    console.log("Link encontrado:", linkData);

    // PASSO 2: Verificar validade do link
    console.log("Passo 2: Verificando validade do link...");
    
    if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
      console.log("Link expirado:", linkData.expires_at);
      return { error: "Link de avaliação expirado" };
    }

    if (linkData.used_at) {
      console.log("Link já foi usado:", linkData.used_at);
      return { error: "Este link de avaliação já foi utilizado" };
    }

    console.log("Link válido! Prosseguindo...");

    // PASSO 3: Buscar template (query separada)
    console.log("Passo 3: Buscando template...");
    const { data: templateData, error: templateError } = await supabase
      .from('checklist_templates')
      .select(`
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
      `)
      .eq('id', linkData.template_id)
      .maybeSingle();

    if (templateError || !templateData) {
      console.error("Erro ao buscar template:", templateError);
      return { error: "Template de avaliação não encontrado" };
    }

    console.log("Template encontrado:", templateData);

    // PASSO 4: Buscar questões do template (query separada)
    console.log("Passo 4: Buscando questões...");
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('template_id', linkData.template_id)
      .order('order_number');

    if (questionsError) {
      console.error("Erro ao buscar questões:", questionsError);
    }

    console.log("Questões encontradas:", questionsData?.length || 0);

    // PASSO 5: Mapear tipo do template
    console.log("Passo 5: Mapeando tipo do template...");
    const templateType = mapDbTemplateTypeToApp(templateData.type);
    console.log("Tipo mapeado:", templateType);

    // PASSO 6: Transformar questões do banco para o formato esperado
    console.log("Passo 6: Transformando questões...");
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

    console.log("Questões transformadas:", questions.length);

    // PASSO 7: Montar o template completo
    console.log("Passo 7: Montando template completo...");
    const template: ChecklistTemplate = {
      id: templateData.id,
      title: templateData.title,
      description: templateData.description || "",
      type: templateType,
      questions,
      createdAt: new Date(templateData.created_at),
      updatedAt: templateData.updated_at ? new Date(templateData.updated_at) : undefined,
      scaleType: templateData.scale_type as any,
      isStandard: templateData.is_standard,
      companyId: templateData.company_id,
      derivedFromId: templateData.derived_from_id,
      estimatedTimeMinutes: templateData.estimated_time_minutes,
      maxScore: templateData.max_score,
      cutoffScores: templateData.cutoff_scores,
      interpretationGuide: templateData.interpretation_guide,
      isActive: templateData.is_active,
      version: templateData.version,
      createdBy: templateData.created_by,
      instructions: templateData.instructions
    };

    console.log("Template completo montado:", template.title);

    const result = {
      template,
      assessmentId: linkData.id,
      linkId: linkData.id,
      employeeId: linkData.employee_id,
      error: null
    };

    console.log("=== FETCH ASSESSMENT BY TOKEN - SUCESSO ===");
    return result;

  } catch (error) {
    console.error("=== FETCH ASSESSMENT BY TOKEN - ERRO ===");
    console.error("Erro ao buscar avaliação:", error);
    return { error: "Erro interno ao buscar avaliação" };
  }
}
