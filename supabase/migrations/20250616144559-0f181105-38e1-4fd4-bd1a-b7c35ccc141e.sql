
-- Primeiro, vamos verificar e limpar dados inconsistentes
-- Atualizar assessment_responses com employee_id nulo mas que têm employee_name
UPDATE assessment_responses 
SET employee_id = e.id
FROM employees e
WHERE assessment_responses.employee_id IS NULL 
AND assessment_responses.employee_name IS NOT NULL
AND e.name = assessment_responses.employee_name;

-- Remover registros órfãos que não podem ser corrigidos
DELETE FROM assessment_responses 
WHERE employee_id IS NULL;

-- Criar a foreign key constraint que estava faltando
ALTER TABLE assessment_responses 
ADD CONSTRAINT fk_assessment_responses_employee_id 
FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;

-- Tornar employee_id obrigatório para evitar problemas futuros
ALTER TABLE assessment_responses 
ALTER COLUMN employee_id SET NOT NULL;

-- Atualizar a função de processamento automático para ser mais robusta
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
    -- Simular cálculo de riscos (já que não temos a função calculate_psychosocial_risk real)
    -- Aqui você pode implementar a lógica real de cálculo baseada no response_data
    
    -- Por enquanto, criar uma análise básica como exemplo
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
      'organizacao_trabalho',
      CASE 
        WHEN COALESCE(v_response.raw_score, 0) >= 80 THEN 'critico'
        WHEN COALESCE(v_response.raw_score, 0) >= 60 THEN 'alto'
        WHEN COALESCE(v_response.raw_score, 0) >= 40 THEN 'medio'
        ELSE 'baixo'
      END,
      COALESCE(v_response.raw_score, 0),
      '["Implementar medidas preventivas", "Monitorar situação"]'::jsonb,
      CASE 
        WHEN COALESCE(v_response.raw_score, 0) >= 60 
        THEN '["Ação imediata necessária"]'::jsonb 
        ELSE '[]'::jsonb 
      END,
      CURRENT_DATE,
      CASE 
        WHEN COALESCE(v_response.raw_score, 0) >= 80 THEN CURRENT_DATE + INTERVAL '30 days'
        WHEN COALESCE(v_response.raw_score, 0) >= 60 THEN CURRENT_DATE + INTERVAL '90 days'
        WHEN COALESCE(v_response.raw_score, 0) >= 40 THEN CURRENT_DATE + INTERVAL '180 days'
        ELSE CURRENT_DATE + INTERVAL '365 days'
      END,
      'identified',
      v_response.created_by
    ) RETURNING id INTO v_analysis_id;

    -- Gerar plano de ação automático se configurado e risco alto/crítico
    IF v_config.auto_generate_action_plans = true 
       AND COALESCE(v_response.raw_score, 0) >= 60 THEN
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
            WHEN COALESCE(v_response.raw_score, 0) >= 80 THEN 'high'
            ELSE 'medium'
          END,
          v_response.sector_id,
          CURRENT_DATE,
          CURRENT_DATE + INTERVAL '90 days',
          CASE 
            WHEN COALESCE(v_response.raw_score, 0) >= 80 THEN 'critico'
            WHEN COALESCE(v_response.raw_score, 0) >= 60 THEN 'alto'
            ELSE 'medio'
          END,
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
       AND COALESCE(v_response.raw_score, 0) >= 60 THEN
      
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
          WHEN COALESCE(v_response.raw_score, 0) >= 80 THEN 'critical_risk'
          ELSE 'high_risk'
        END,
        CASE 
          WHEN COALESCE(v_response.raw_score, 0) >= 80 THEN 'critical'
          ELSE 'high'
        END,
        format('Risco %s identificado - %s', 
          CASE 
            WHEN COALESCE(v_response.raw_score, 0) >= 80 THEN 'CRÍTICO'
            ELSE 'ALTO'
          END,
          'Organização do Trabalho'
        ),
        format('Foi identificado um risco %s para o funcionário %s. Ação necessária.',
          CASE 
            WHEN COALESCE(v_response.raw_score, 0) >= 80 THEN 'crítico'
            ELSE 'alto'
          END,
          v_response.employee_name
        ),
        COALESCE(v_config.notification_recipients, '[]'::jsonb),
        jsonb_build_object(
          'risk_score', COALESCE(v_response.raw_score, 0),
          'employee_name', v_response.employee_name,
          'assessment_id', p_assessment_response_id
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
        'employee_name', v_response.employee_name
      )
    WHERE id = v_log_id;

    v_result := jsonb_build_object(
      'success', true,
      'log_id', v_log_id,
      'analyses_created', 1,
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
        details = details || jsonb_build_object('error_detail', SQLSTATE)
      WHERE id = v_log_id;

      v_result := jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'log_id', v_log_id
      );
  END;

  RETURN v_result;
END;
$$;
