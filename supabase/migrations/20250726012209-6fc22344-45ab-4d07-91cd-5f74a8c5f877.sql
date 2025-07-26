-- Corrigir função process_psychosocial_assessment_auto para incluir SET search_path
CREATE OR REPLACE FUNCTION public.process_psychosocial_assessment_auto(p_assessment_response_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_response RECORD;
  v_company_id UUID;
  v_config RECORD;
  v_log_id UUID;
  v_analysis_id UUID;
  v_result JSONB;
  v_exposure_level psychosocial_exposure_level;
  v_calculated_score NUMERIC;
  v_response_data JSONB;
  v_total_score NUMERIC := 0;
  v_question_count INTEGER := 0;
  v_key TEXT;
  v_value NUMERIC;
BEGIN
  -- Buscar dados da avaliação com JOIN explícito
  SELECT 
    ar.*,
    e.company_id,
    e.sector_id,
    e.role_id,
    e.name as employee_name,
    c.name as company_name
  INTO v_response
  FROM assessment_responses ar
  INNER JOIN employees e ON ar.employee_id = e.id
  INNER JOIN companies c ON e.company_id = c.id
  WHERE ar.id = p_assessment_response_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Assessment response not found or employee not associated: %', p_assessment_response_id;
  END IF;

  v_company_id := v_response.company_id;
  v_response_data := v_response.response_data;

  -- Calcular score baseado nas respostas (escala Likert 1-5)
  IF v_response_data IS NOT NULL THEN
    FOR v_key, v_value IN SELECT key, value::text::numeric FROM jsonb_each_text(v_response_data)
    LOOP
      -- Verificar se o valor é um número válido (1-5)
      IF v_value >= 1 AND v_value <= 5 THEN
        v_total_score := v_total_score + v_value;
        v_question_count := v_question_count + 1;
      END IF;
    END LOOP;
    
    -- Calcular score médio e converter para escala 0-100
    IF v_question_count > 0 THEN
      v_calculated_score := (v_total_score / v_question_count) * 20; -- Converte escala 1-5 para 0-100
    ELSE
      v_calculated_score := 0;
    END IF;
  ELSE
    v_calculated_score := COALESCE(v_response.raw_score, 0);
  END IF;

  -- Atualizar o raw_score na tabela de assessment_responses se ainda não foi calculado
  IF v_response.raw_score IS NULL AND v_calculated_score > 0 THEN
    UPDATE assessment_responses 
    SET raw_score = v_calculated_score 
    WHERE id = p_assessment_response_id;
  END IF;

  -- Buscar configuração de automação
  SELECT * INTO v_config
  FROM psychosocial_automation_config
  WHERE company_id = v_company_id;

  -- Se não tiver configuração, criar uma padrão
  IF v_config IS NULL THEN
    INSERT INTO psychosocial_automation_config (
      company_id,
      auto_process_enabled,
      auto_generate_action_plans,
      notification_enabled
    ) VALUES (
      v_company_id,
      true,
      true,
      true
    ) RETURNING * INTO v_config;
  END IF;

  -- Se automação desabilitada, retornar
  IF v_config.auto_process_enabled = false THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Auto processing disabled for this company'
    );
  END IF;

  -- Criar log de processamento
  INSERT INTO psychosocial_processing_logs (
    assessment_response_id,
    company_id,
    processing_stage,
    status
  ) VALUES (
    p_assessment_response_id,
    v_company_id,
    'started',
    'processing'
  ) RETURNING id INTO v_log_id;

  BEGIN
    -- Determinar exposure_level baseado no score calculado
    IF v_calculated_score >= 80 THEN
      v_exposure_level := 'critico'::psychosocial_exposure_level;
    ELSIF v_calculated_score >= 60 THEN
      v_exposure_level := 'alto'::psychosocial_exposure_level;
    ELSIF v_calculated_score >= 40 THEN
      v_exposure_level := 'medio'::psychosocial_exposure_level;
    ELSE
      v_exposure_level := 'baixo'::psychosocial_exposure_level;
    END IF;
    
    -- Inserir análise de risco usando o score calculado
    INSERT INTO psychosocial_risk_analysis (
      company_id,
      sector_id,
      role_id,
      assessment_response_id,
      category,
      exposure_level,
      risk_score,
      recommended_actions,
      mandatory_measures,
      evaluation_date,
      next_evaluation_date,
      status,
      created_by
    ) VALUES (
      v_company_id,
      v_response.sector_id,
      v_response.role_id,
      p_assessment_response_id,
      'organizacao_trabalho'::psychosocial_risk_category,
      v_exposure_level,
      v_calculated_score,
      CASE 
        WHEN v_exposure_level IN ('alto'::psychosocial_exposure_level, 'critico'::psychosocial_exposure_level)
        THEN '["Implementar medidas de controle", "Monitorar situação regularmente", "Avaliar efetividade das ações"]'::jsonb
        WHEN v_exposure_level = 'medio'::psychosocial_exposure_level
        THEN '["Implementar medidas preventivas", "Aumentar frequência de monitoramento"]'::jsonb
        ELSE '["Manter monitoramento periódico"]'::jsonb
      END,
      CASE 
        WHEN v_exposure_level IN ('alto'::psychosocial_exposure_level, 'critico'::psychosocial_exposure_level)
        THEN '["Ação imediata necessária conforme NR-01"]'::jsonb 
        ELSE '[]'::jsonb 
      END,
      CURRENT_DATE,
      CASE 
        WHEN v_exposure_level = 'critico'::psychosocial_exposure_level THEN CURRENT_DATE + INTERVAL '30 days'
        WHEN v_exposure_level = 'alto'::psychosocial_exposure_level THEN CURRENT_DATE + INTERVAL '90 days'
        WHEN v_exposure_level = 'medio'::psychosocial_exposure_level THEN CURRENT_DATE + INTERVAL '180 days'
        ELSE CURRENT_DATE + INTERVAL '365 days'
      END,
      'identified',
      v_response.created_by
    ) RETURNING id INTO v_analysis_id;

    -- Gerar plano de ação automático se configurado e risco alto/crítico
    IF v_config.auto_generate_action_plans = true 
       AND v_exposure_level IN ('alto'::psychosocial_exposure_level, 'critico'::psychosocial_exposure_level) THEN
      BEGIN
        INSERT INTO action_plans (
          company_id,
          title,
          description,
          status,
          priority,
          sector_id,
          start_date,
          due_date,
          risk_level,
          created_by
        ) VALUES (
          v_company_id,
          'Plano de Ação NR-01 - ' || COALESCE(v_response.employee_name, 'Funcionário'),
          'Plano de ação gerado automaticamente baseado na análise de risco psicossocial com score ' || v_calculated_score::text || '% (nível ' || v_exposure_level::text || ').',
          'draft',
          CASE 
            WHEN v_exposure_level = 'critico'::psychosocial_exposure_level THEN 'high'
            ELSE 'medium'
          END,
          v_response.sector_id,
          CURRENT_DATE,
          CURRENT_DATE + INTERVAL '90 days',
          v_exposure_level::text,
          v_response.created_by
        );
      EXCEPTION
        WHEN OTHERS THEN
          -- Log error but continue processing
          UPDATE psychosocial_processing_logs 
          SET details = details || jsonb_build_object(
            'action_plan_error', SQLERRM,
            'analysis_id', v_analysis_id
          )
          WHERE id = v_log_id;
      END;
    END IF;

    -- Atualizar log de sucesso
    UPDATE psychosocial_processing_logs 
    SET 
      status = 'completed',
      completed_at = now(),
      processing_stage = 'finished',
      details = jsonb_build_object(
        'risk_analyses_created', 1,
        'processing_time_seconds', EXTRACT(EPOCH FROM (now() - started_at)),
        'employee_name', v_response.employee_name,
        'exposure_level', v_exposure_level::text,
        'calculated_score', v_calculated_score,
        'questions_processed', v_question_count
      )
    WHERE id = v_log_id;

    v_result := jsonb_build_object(
      'success', true,
      'log_id', v_log_id,
      'analyses_created', 1,
      'exposure_level', v_exposure_level::text,
      'calculated_score', v_calculated_score,
      'message', 'Processing completed successfully for ' || COALESCE(v_response.employee_name, 'Funcionário') || ' with score ' || v_calculated_score::text || '%'
    );

  EXCEPTION
    WHEN OTHERS THEN
      -- Log error
      UPDATE psychosocial_processing_logs 
      SET 
        status = 'error',
        completed_at = now(),
        error_message = SQLERRM,
        details = details || jsonb_build_object(
          'error_detail', SQLSTATE,
          'error_hint', 'Error in score calculation or risk analysis creation',
          'calculated_score', v_calculated_score
        )
      WHERE id = v_log_id;

      v_result := jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'error_code', SQLSTATE,
        'log_id', v_log_id
      );
  END;

  RETURN v_result;
END;
$function$;