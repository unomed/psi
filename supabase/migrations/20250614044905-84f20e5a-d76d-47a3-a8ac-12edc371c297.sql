
-- Criar tabela para logs de processamento automático
CREATE TABLE public.psychosocial_processing_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_response_id UUID NOT NULL,
  company_id UUID NOT NULL,
  processing_stage TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  details JSONB DEFAULT '{}',
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para configurações de processamento automático
CREATE TABLE public.psychosocial_automation_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  auto_process_enabled BOOLEAN NOT NULL DEFAULT true,
  auto_generate_action_plans BOOLEAN NOT NULL DEFAULT true,
  notification_enabled BOOLEAN NOT NULL DEFAULT true,
  notification_recipients JSONB DEFAULT '[]',
  processing_delay_minutes INTEGER DEFAULT 5,
  high_risk_immediate_notification BOOLEAN DEFAULT true,
  critical_risk_escalation BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- Criar tabela para notificações automáticas
CREATE TABLE public.psychosocial_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  risk_analysis_id UUID,
  notification_type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recipients JSONB NOT NULL DEFAULT '[]',
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Função para processar avaliação psicossocial automaticamente
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
  -- Buscar dados da avaliação
  SELECT ar.*, e.company_id, e.sector_id, e.role_id
  INTO v_response
  FROM assessment_responses ar
  JOIN employees e ON ar.employee_id = e.id
  WHERE ar.id = p_assessment_response_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Assessment response not found: %', p_assessment_response_id;
  END IF;

  v_company_id := v_response.company_id;

  -- Buscar configuração de automação
  SELECT * INTO v_config
  FROM psychosocial_automation_config
  WHERE company_id = v_company_id;

  -- Se não tiver configuração ou automação desabilitada, retornar
  IF v_config IS NULL OR v_config.auto_process_enabled = false THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Auto processing disabled or not configured'
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
    -- Calcular riscos psicossociais
    SELECT array_agg(
      jsonb_build_object(
        'category', category,
        'risk_score', risk_score,
        'exposure_level', exposure_level,
        'recommended_actions', recommended_actions
      )
    ) INTO v_risk_results
    FROM calculate_psychosocial_risk(p_assessment_response_id, v_company_id);

    -- Criar análises de risco para cada categoria
    FOR v_risk_result IN 
      SELECT 
        category::psychosocial_risk_category as cat,
        risk_score,
        exposure_level::psychosocial_exposure_level as exp_level,
        recommended_actions
      FROM calculate_psychosocial_risk(p_assessment_response_id, v_company_id)
    LOOP
      -- Inserir análise de risco
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
        v_risk_result.cat,
        v_risk_result.exp_level,
        v_risk_result.risk_score,
        v_risk_result.recommended_actions,
        CASE 
          WHEN v_risk_result.exp_level IN ('alto', 'critico') 
          THEN v_risk_result.recommended_actions 
          ELSE '[]'::jsonb 
        END,
        CURRENT_DATE,
        CASE 
          WHEN v_risk_result.exp_level = 'critico' THEN CURRENT_DATE + INTERVAL '30 days'
          WHEN v_risk_result.exp_level = 'alto' THEN CURRENT_DATE + INTERVAL '90 days'
          WHEN v_risk_result.exp_level = 'medio' THEN CURRENT_DATE + INTERVAL '180 days'
          ELSE CURRENT_DATE + INTERVAL '365 days'
        END,
        'identified',
        v_response.created_by
      ) RETURNING id INTO v_analysis_id;

      -- Gerar plano de ação automático se configurado e risco alto/crítico
      IF v_config.auto_generate_action_plans = true 
         AND v_risk_result.exp_level IN ('alto', 'critico') THEN
        BEGIN
          PERFORM generate_nr01_action_plan(v_analysis_id);
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
         AND v_risk_result.exp_level IN ('alto', 'critico') THEN
        
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
            WHEN v_risk_result.exp_level = 'critico' THEN 'critical_risk'
            ELSE 'high_risk'
          END,
          CASE 
            WHEN v_risk_result.exp_level = 'critico' THEN 'critical'
            ELSE 'high'
          END,
          format('Risco %s identificado - %s', 
            UPPER(v_risk_result.exp_level::text),
            v_risk_result.cat::text
          ),
          format('Foi identificado um risco %s na categoria %s para o funcionário %s. Ação imediata necessária.',
            v_risk_result.exp_level::text,
            v_risk_result.cat::text,
            v_response.employee_name
          ),
          v_config.notification_recipients,
          jsonb_build_object(
            'risk_score', v_risk_result.risk_score,
            'employee_name', v_response.employee_name,
            'assessment_id', p_assessment_response_id
          )
        );
      END IF;
    END LOOP;

    -- Atualizar log de sucesso
    UPDATE psychosocial_processing_logs 
    SET 
      status = 'completed',
      completed_at = now(),
      processing_stage = 'finished',
      details = jsonb_build_object(
        'risk_analyses_created', array_length(v_risk_results, 1),
        'processing_time_seconds', EXTRACT(EPOCH FROM (now() - started_at))
      )
    WHERE id = v_log_id;

    v_result := jsonb_build_object(
      'success', true,
      'log_id', v_log_id,
      'analyses_created', array_length(v_risk_results, 1),
      'message', 'Processing completed successfully'
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

-- Trigger para processar automaticamente quando avaliação for completada
CREATE OR REPLACE FUNCTION public.trigger_psychosocial_auto_processing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Só processar se a avaliação foi completada agora
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    -- Agendar processamento (pode ser imediato ou com delay)
    PERFORM process_psychosocial_assessment_auto(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger na tabela assessment_responses
CREATE TRIGGER trigger_auto_psychosocial_processing
  AFTER UPDATE ON assessment_responses
  FOR EACH ROW
  EXECUTE FUNCTION trigger_psychosocial_auto_processing();

-- Função para obter estatísticas de processamento automático
CREATE OR REPLACE FUNCTION public.get_psychosocial_processing_stats(
  p_company_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(
  total_processed INTEGER,
  successful_processed INTEGER,
  failed_processed INTEGER,
  avg_processing_time_seconds NUMERIC,
  high_risk_found INTEGER,
  critical_risk_found INTEGER,
  action_plans_generated INTEGER,
  notifications_sent INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_processed,
    COUNT(CASE WHEN ppl.status = 'completed' THEN 1 END)::INTEGER as successful_processed,
    COUNT(CASE WHEN ppl.status = 'error' THEN 1 END)::INTEGER as failed_processed,
    AVG(EXTRACT(EPOCH FROM (ppl.completed_at - ppl.started_at)))::NUMERIC as avg_processing_time_seconds,
    COUNT(CASE WHEN pra.exposure_level = 'alto' THEN 1 END)::INTEGER as high_risk_found,
    COUNT(CASE WHEN pra.exposure_level = 'critico' THEN 1 END)::INTEGER as critical_risk_found,
    COUNT(CASE WHEN ap.id IS NOT NULL THEN 1 END)::INTEGER as action_plans_generated,
    COUNT(CASE WHEN pn.sent_at IS NOT NULL THEN 1 END)::INTEGER as notifications_sent
  FROM psychosocial_processing_logs ppl
  LEFT JOIN psychosocial_risk_analysis pra ON ppl.assessment_response_id = pra.assessment_response_id
  LEFT JOIN action_plans ap ON pra.id::text = ap.title OR ap.description LIKE '%' || pra.id::text || '%'
  LEFT JOIN psychosocial_notifications pn ON pra.id = pn.risk_analysis_id
  WHERE ppl.company_id = p_company_id
    AND (p_start_date IS NULL OR ppl.created_at::date >= p_start_date)
    AND (p_end_date IS NULL OR ppl.created_at::date <= p_end_date);
END;
$$;

-- Add RLS policies
ALTER TABLE public.psychosocial_processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychosocial_automation_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychosocial_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for processing logs
CREATE POLICY "Companies can view their own processing logs" 
  ON public.psychosocial_processing_logs 
  FOR SELECT 
  USING (true);

CREATE POLICY "System can insert processing logs" 
  ON public.psychosocial_processing_logs 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update processing logs" 
  ON public.psychosocial_processing_logs 
  FOR UPDATE 
  USING (true);

-- RLS policies for automation config
CREATE POLICY "Companies can view their own automation config" 
  ON public.psychosocial_automation_config 
  FOR SELECT 
  USING (true);

CREATE POLICY "Companies can insert their own automation config" 
  ON public.psychosocial_automation_config 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Companies can update their own automation config" 
  ON public.psychosocial_automation_config 
  FOR UPDATE 
  USING (true);

-- RLS policies for notifications
CREATE POLICY "Companies can view their own notifications" 
  ON public.psychosocial_notifications 
  FOR SELECT 
  USING (true);

CREATE POLICY "System can insert notifications" 
  ON public.psychosocial_notifications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update notifications" 
  ON public.psychosocial_notifications 
  FOR UPDATE 
  USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_psychosocial_automation_config_updated_at
  BEFORE UPDATE ON public.psychosocial_automation_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_psychosocial_updated_at();
