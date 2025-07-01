
-- Corrigir a função calculate_psychosocial_risk para retornar tipos enum corretos
CREATE OR REPLACE FUNCTION public.calculate_psychosocial_risk(
  p_assessment_response_id UUID, 
  p_company_id UUID
)
RETURNS TABLE(
  category psychosocial_risk_category, 
  risk_score numeric, 
  exposure_level psychosocial_exposure_level, 
  recommended_actions jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  response_data jsonb;
  criteria_rec RECORD;
  calculated_score numeric;
  exposure_lvl psychosocial_exposure_level;
  actions jsonb;
BEGIN
  -- Buscar dados da resposta de avaliação
  SELECT ar.response_data INTO response_data 
  FROM assessment_responses ar
  WHERE ar.id = p_assessment_response_id;
  
  -- Para cada categoria de risco psicossocial
  FOR criteria_rec IN 
    SELECT DISTINCT 
      category, 
      threshold_low, 
      threshold_medium, 
      threshold_high, 
      mandatory_actions
    FROM psychosocial_criteria 
    WHERE company_id = p_company_id OR company_id IS NULL
    AND is_active = true
  LOOP
    -- Calcular score baseado nas respostas (simulação - deve ser adaptado conforme estrutura real)
    calculated_score := COALESCE((response_data->>'total_score')::numeric, 
                                COALESCE((response_data->>'raw_score')::numeric, 50));
    
    -- Determinar nível de exposição usando CAST explícito para o tipo enum
    IF calculated_score <= criteria_rec.threshold_low THEN
      exposure_lvl := 'baixo'::psychosocial_exposure_level;
      actions := '["Manter monitoramento periódico"]'::jsonb;
    ELSIF calculated_score <= criteria_rec.threshold_medium THEN
      exposure_lvl := 'medio'::psychosocial_exposure_level;
      actions := '["Implementar medidas preventivas", "Aumentar frequência de monitoramento"]'::jsonb;
    ELSIF calculated_score <= criteria_rec.threshold_high THEN
      exposure_lvl := 'alto'::psychosocial_exposure_level;
      actions := COALESCE(criteria_rec.mandatory_actions, '["Implementar medidas de controle"]'::jsonb);
    ELSE
      exposure_lvl := 'critico'::psychosocial_exposure_level;
      actions := jsonb_build_array('Implementar medidas de controle imediatas', 'Afastamento temporário se necessário') || 
                 COALESCE(criteria_rec.mandatory_actions, '[]'::jsonb);
    END IF;
    
    RETURN QUERY SELECT 
      criteria_rec.category::psychosocial_risk_category,
      calculated_score,
      exposure_lvl,
      actions;
  END LOOP;
  
  -- Se não encontrou critérios, retornar dados padrão
  IF NOT FOUND THEN
    calculated_score := COALESCE((response_data->>'total_score')::numeric, 
                                COALESCE((response_data->>'raw_score')::numeric, 50));
    
    IF calculated_score >= 80 THEN
      exposure_lvl := 'critico'::psychosocial_exposure_level;
    ELSIF calculated_score >= 60 THEN
      exposure_lvl := 'alto'::psychosocial_exposure_level;
    ELSIF calculated_score >= 40 THEN
      exposure_lvl := 'medio'::psychosocial_exposure_level;
    ELSE
      exposure_lvl := 'baixo'::psychosocial_exposure_level;
    END IF;
    
    RETURN QUERY SELECT 
      'organizacao_trabalho'::psychosocial_risk_category,
      calculated_score,
      exposure_lvl,
      '["Implementar medidas preventivas", "Monitorar situação"]'::jsonb;
  END IF;
END;
$$;

-- Atualizar a função process_psychosocial_assessment_auto para usar tipos enum corretos
CREATE OR REPLACE FUNCTION public.process_psychosocial_assessment_auto(
  p_assessment_response_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_response RECORD;
  v_company_id UUID;
  v_config RECORD;
  v_log_id UUID;
  v_risk_results JSONB[];
  v_risk_result RECORD;
  v_analysis_id UUID;
  v_notification_data JSONB;
  v_result JSONB;
  v_exposure_level psychosocial_exposure_level;
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
    -- Determinar exposure_level baseado no raw_score usando cast explícito
    IF COALESCE(v_response.raw_score, 0) >= 80 THEN
      v_exposure_level := 'critico'::psychosocial_exposure_level;
    ELSIF COALESCE(v_response.raw_score, 0) >= 60 THEN
      v_exposure_level := 'alto'::psychosocial_exposure_level;
    ELSIF COALESCE(v_response.raw_score, 0) >= 40 THEN
      v_exposure_level := 'medio'::psychosocial_exposure_level;
    ELSE
      v_exposure_level := 'baixo'::psychosocial_exposure_level;
    END IF;
    
    -- Inserir análise de risco usando o enum correto
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
      COALESCE(v_response.raw_score, 0),
      '["Implementar medidas preventivas", "Monitorar situação"]'::jsonb,
      CASE 
        WHEN v_exposure_level IN ('alto'::psychosocial_exposure_level, 'critico'::psychosocial_exposure_level)
        THEN '["Ação imediata necessária"]'::jsonb 
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
          'Plano de Ação NR-01 - ' || v_response.employee_name,
          'Plano de ação gerado automaticamente baseado na análise de risco psicossocial.',
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

    -- Criar notificação para riscos altos/críticos
    IF v_config.notification_enabled = true 
       AND v_exposure_level IN ('alto'::psychosocial_exposure_level, 'critico'::psychosocial_exposure_level) THEN
      
      INSERT INTO psychosocial_notifications (
        company_id,
        risk_analysis_id,
        notification_type,
        priority,
        title,
        message,
        recipients,
        metadata
      ) VALUES (
        v_company_id,
        v_analysis_id,
        CASE 
          WHEN v_exposure_level = 'critico'::psychosocial_exposure_level THEN 'critical_risk'
          ELSE 'high_risk'
        END,
        CASE 
          WHEN v_exposure_level = 'critico'::psychosocial_exposure_level THEN 'critical'
          ELSE 'high'
        END,
        format('Risco %s identificado - %s', 
          CASE 
            WHEN v_exposure_level = 'critico'::psychosocial_exposure_level THEN 'CRÍTICO'
            ELSE 'ALTO'
          END,
          'Organização do Trabalho'
        ),
        format('Foi identificado um risco %s para o funcionário %s. Ação necessária.',
          v_exposure_level::text,
          v_response.employee_name
        ),
        COALESCE(v_config.notification_recipients, '[]'::jsonb),
        jsonb_build_object(
          'risk_score', COALESCE(v_response.raw_score, 0),
          'employee_name', v_response.employee_name,
          'assessment_id', p_assessment_response_id,
          'exposure_level', v_exposure_level::text
        )
      );
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
        'exposure_level', v_exposure_level::text
      )
    WHERE id = v_log_id;

    v_result := jsonb_build_object(
      'success', true,
      'log_id', v_log_id,
      'analyses_created', 1,
      'exposure_level', v_exposure_level::text,
      'message', 'Processing completed successfully for ' || v_response.employee_name
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
          'error_hint', 'Check enum type casting for exposure_level'
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
$$;
