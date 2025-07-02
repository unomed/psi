import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate, DiscQuestion, PsicossocialQuestion } from "@/types";
import { mapDbTemplateTypeToApp } from "@/services/checklist/templateUtils";

export async function submitAssessmentResult(resultData: Omit<any, "id" | "completedAt">) {
  try {
    console.log('[submitAssessmentResult] Dados recebidos:', resultData);
    
    // Garantir que o employee_id esteja definido no resultData
    if (!resultData.employeeId) {
      console.error('[submitAssessmentResult] Employee ID não fornecido');
      return { error: "ID do funcionário é obrigatório", result: null };
    }

    console.log('[submitAssessmentResult] Enviando resultado para funcionário:', resultData.employeeId);

    const { data: result, error } = await supabase
      .from('assessment_responses')
      .insert({
        template_id: resultData.templateId,
        employee_id: resultData.employeeId,
        employee_name: resultData.employeeName,
        response_data: resultData.responses,
        factors_scores: resultData.factorsScores,
        dominant_factor: resultData.dominantFactor,
        raw_score: resultData.rawScore,
        risk_level: resultData.riskLevel,
        notes: resultData.notes
      })
      .select()
      .single();

    if (error) {
      console.error('[submitAssessmentResult] Erro ao salvar resultado:', error);
      return { error: "Erro ao salvar resultado da avaliação: " + error.message, result: null };
    }

    console.log('[submitAssessmentResult] Resultado salvo com sucesso:', result);

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
    console.log("Token recebido (original):", token);
    
    // PASSO 0: Tratamento robusto do token
    let cleanToken = token;
    
    // Decodificar URL se necessário
    if (token.includes('%')) {
      cleanToken = decodeURIComponent(token);
      console.log("Token após decodificação URL:", cleanToken);
    }
    
    // Remover espaços em branco
    cleanToken = cleanToken.trim();
    console.log("Token limpo final:", cleanToken);
    
    // Validar formato básico do token
    if (!cleanToken || cleanToken.length < 10) {
      console.error("Token inválido - muito curto:", cleanToken);
      return { error: "Token de avaliação inválido" };
    }
    
    // PASSO 1: Buscar link de avaliação com debug melhorado
    console.log("Passo 1: Buscando link de avaliação...");
    console.log("Query SQL equivalente: SELECT * FROM assessment_links WHERE token = '" + cleanToken + "'");
    
    const { data: linkData, error: linkError } = await supabase
      .from('assessment_links')
      .select('id, employee_id, template_id, expires_at, used_at, created_at, token')
      .eq('token', cleanToken)
      .maybeSingle();

    console.log("Resultado da query assessment_links:");
    console.log("- linkData:", linkData);
    console.log("- linkError:", linkError);

    if (linkError) {
      console.error("Erro ao buscar link (SQL):", linkError);
      return { error: "Erro na consulta do link de avaliação: " + linkError.message };
    }

    if (!linkData) {
      console.log("Link não encontrado. Tentando busca alternativa...");
      
      // Busca alternativa - todos os tokens para debug
      const { data: allTokens, error: allTokensError } = await supabase
        .from('assessment_links')
        .select('token, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
        
      console.log("Últimos 10 tokens no banco:", allTokens);
      console.log("Erro na busca de tokens:", allTokensError);
      
      // Busca com LIKE para tokens similares
      const { data: similarTokens, error: similarError } = await supabase
        .from('assessment_links')
        .select('token, id, created_at')
        .ilike('token', `%${cleanToken.substring(0, 10)}%`)
        .limit(5);
        
      console.log("Tokens similares encontrados:", similarTokens);
      
      return { error: "Link de avaliação não encontrado no banco de dados" };
    }

    console.log("Link encontrado com sucesso:", {
      id: linkData.id,
      employee_id: linkData.employee_id,
      template_id: linkData.template_id,
      token_match: linkData.token === cleanToken
    });

    // PASSO 2: Verificar validade do link com melhor diagnóstico
    console.log("Passo 2: Verificando validade do link...");
    
    const now = new Date();
    const expiresAt = linkData.expires_at ? new Date(linkData.expires_at) : null;
    const usedAt = linkData.used_at ? new Date(linkData.used_at) : null;
    
    console.log("Verificação de validade:", {
      now: now.toISOString(),
      expires_at: linkData.expires_at,
      used_at: linkData.used_at,
      is_expired: expiresAt ? expiresAt < now : false,
      is_used: !!usedAt
    });
    
    if (expiresAt && expiresAt < now) {
      console.log("Link expirado:", {
        expires_at: linkData.expires_at,
        expired_hours_ago: Math.round((now.getTime() - expiresAt.getTime()) / (1000 * 60 * 60))
      });
      return { error: "Link de avaliação expirado" };
    }

    if (usedAt) {
      console.log("Link já foi usado:", {
        used_at: linkData.used_at,
        used_hours_ago: Math.round((now.getTime() - usedAt.getTime()) / (1000 * 60 * 60))
      });
      return { error: "Este link de avaliação já foi utilizado" };
    }

    console.log("Link válido! Prosseguindo...");

    // PASSO 3: Buscar template com error handling melhorado
    console.log("Passo 3: Buscando template...");
    console.log("Template ID a buscar:", linkData.template_id);
    
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

    console.log("Resultado da busca do template:");
    console.log("- templateData:", templateData ? { id: templateData.id, title: templateData.title } : null);
    console.log("- templateError:", templateError);

    if (templateError) {
      console.error("Erro ao buscar template:", templateError);
      return { error: "Erro na consulta do template: " + templateError.message };
    }
    
    if (!templateData) {
      console.error("Template não encontrado:", linkData.template_id);
      return { error: "Template de avaliação não encontrado" };
    }

    console.log("Template encontrado:", {
      id: templateData.id,
      title: templateData.title,
      type: templateData.type,
      is_active: templateData.is_active
    });

    // PASSO 4: Buscar questões com debug
    console.log("Passo 4: Buscando questões...");
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('template_id', linkData.template_id)
      .order('order_number');

    console.log("Resultado da busca de questões:");
    console.log("- questionsData length:", questionsData?.length || 0);
    console.log("- questionsError:", questionsError);

    if (questionsError) {
      console.error("Erro ao buscar questões:", questionsError);
      return { error: "Erro na consulta das questões: " + questionsError.message };
    }

    // PASSO 5: Mapear tipo do template
    console.log("Passo 5: Mapeando tipo do template...");
    const templateType = mapDbTemplateTypeToApp(templateData.type);
    console.log("Tipo mapeado:", templateType);

    // PASSO 6: Transformar questões
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
      questions = (questionsData || []).map(q => ({
        id: q.id,
        text: q.question_text,
        targetFactor: q.target_factor as any,
        weight: q.weight || 1
      })) as DiscQuestion[];
    }

    console.log("Questões transformadas:", questions.length);

    // PASSO 7: Montar template completo
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

    console.log("Template completo montado:", {
      id: template.id,
      title: template.title,
      questionsCount: template.questions.length
    });

    const result = {
      template,
      assessmentId: linkData.id,
      linkId: linkData.id,
      employeeId: linkData.employee_id,
      error: null
    };

    console.log("=== FETCH ASSESSMENT BY TOKEN - SUCESSO ===");
    console.log("Resultado final:", {
      template_id: result.template.id,
      employee_id: result.employeeId,
      questions_count: result.template.questions.length
    });
    
    return result;

  } catch (error) {
    console.error("=== FETCH ASSESSMENT BY TOKEN - ERRO CRÍTICO ===");
    console.error("Erro detalhado:", {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      token: token
    });
    return { error: "Erro interno ao buscar avaliação: " + (error?.message || 'Erro desconhecido') };
  }
}
