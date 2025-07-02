-- FASE 3: Atualização das tabelas existentes para suportar classificação FRPRT

-- 1. Atualizar risk_assessments para incluir campos FRPRT
ALTER TABLE public.risk_assessments 
ADD COLUMN IF NOT EXISTS frprt_organizacao_trabalho INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS frprt_condicoes_psicossociais INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS frprt_relacoes_socioprofissionais INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS frprt_reconhecimento_crescimento INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS frprt_equilibrio_trabalho_vida INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS overall_risk_level TEXT DEFAULT 'baixo',
ADD COLUMN IF NOT EXISTS exposure_intensity TEXT DEFAULT 'baixa',
ADD COLUMN IF NOT EXISTS manifestations_found JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS required_actions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS action_deadline DATE,
ADD COLUMN IF NOT EXISTS compliance_status TEXT DEFAULT 'pending';

-- 2. Atualizar report_history para incluir campos FRPRT
ALTER TABLE public.report_history 
ADD COLUMN IF NOT EXISTS report_type TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS report_title TEXT DEFAULT 'Relatório',
ADD COLUMN IF NOT EXISTS generated_by UUID,
ADD COLUMN IF NOT EXISTS generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS period_start DATE,
ADD COLUMN IF NOT EXISTS period_end DATE,
ADD COLUMN IF NOT EXISTS total_assessments INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS frprt_findings JSONB DEFAULT '{}';

-- 3. Criar tabela para métricas psicossociais se não existir
CREATE TABLE IF NOT EXISTS public.psychosocial_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  sector_id UUID,
  calculation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Estatísticas FRPRT
  total_assessments INTEGER NOT NULL DEFAULT 0,
  frprt_organizacao_alto INTEGER NOT NULL DEFAULT 0,
  frprt_condicoes_alto INTEGER NOT NULL DEFAULT 0,
  frprt_relacoes_alto INTEGER NOT NULL DEFAULT 0,
  frprt_reconhecimento_alto INTEGER NOT NULL DEFAULT 0,
  frprt_equilibrio_alto INTEGER NOT NULL DEFAULT 0,
  
  -- Níveis de exposição
  exposicao_baixa INTEGER NOT NULL DEFAULT 0,
  exposicao_media INTEGER NOT NULL DEFAULT 0,
  exposicao_alta INTEGER NOT NULL DEFAULT 0,
  exposicao_critica INTEGER NOT NULL DEFAULT 0,
  
  -- Indicadores de saúde organizacional
  taxa_absenteismo NUMERIC(5,2),
  taxa_rotatividade NUMERIC(5,2),
  indice_satisfacao NUMERIC(5,2),
  
  -- Compliance NR-01
  compliance_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  pending_actions INTEGER NOT NULL DEFAULT 0,
  overdue_actions INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Função para processar assessment e gerar classificação FRPRT
CREATE OR REPLACE FUNCTION public.process_frprt_classification(
  p_assessment_response_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_response RECORD;
  v_company_id UUID;
  v_frprt_scores JSONB;
  v_overall_level TEXT;
  v_exposure_intensity TEXT;
  v_manifestations JSONB;
  v_required_actions JSONB;
  v_deadline DATE;
BEGIN
  -- Buscar dados da avaliação
  SELECT 
    ar.*,
    e.company_id,
    e.sector_id,
    e.role_id,
    e.name as employee_name
  INTO v_response
  FROM assessment_responses ar
  INNER JOIN employees e ON ar.employee_id = e.id
  WHERE ar.id = p_assessment_response_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Assessment response not found: %', p_assessment_response_id;
  END IF;

  v_company_id := v_response.company_id;

  -- Processar scores FRPRT baseado nas respostas
  -- (Simulação - deve ser adaptado conforme estrutura real do questionário)
  v_frprt_scores := jsonb_build_object(
    'organizacao_trabalho', LEAST(100, GREATEST(0, COALESCE((v_response.response_data->>'organizacao_score')::INTEGER, COALESCE(v_response.raw_score, 50)))),
    'condicoes_psicossociais', LEAST(100, GREATEST(0, COALESCE((v_response.response_data->>'condicoes_score')::INTEGER, COALESCE(v_response.raw_score, 50)))),
    'relacoes_socioprofissionais', LEAST(100, GREATEST(0, COALESCE((v_response.response_data->>'relacoes_score')::INTEGER, COALESCE(v_response.raw_score, 50)))),
    'reconhecimento_crescimento', LEAST(100, GREATEST(0, COALESCE((v_response.response_data->>'reconhecimento_score')::INTEGER, COALESCE(v_response.raw_score, 50)))),
    'equilibrio_trabalho_vida', LEAST(100, GREATEST(0, COALESCE((v_response.response_data->>'equilibrio_score')::INTEGER, COALESCE(v_response.raw_score, 50))))
  );

  -- Determinar nível geral baseado no maior score
  DECLARE
    max_score INTEGER := GREATEST(
      (v_frprt_scores->>'organizacao_trabalho')::INTEGER,
      (v_frprt_scores->>'condicoes_psicossociais')::INTEGER,
      (v_frprt_scores->>'relacoes_socioprofissionais')::INTEGER,
      (v_frprt_scores->>'reconhecimento_crescimento')::INTEGER,
      (v_frprt_scores->>'equilibrio_trabalho_vida')::INTEGER
    );
  BEGIN
    -- Classificação conforme NR-01
    IF max_score >= 81 THEN
      v_overall_level := 'critico';
      v_exposure_intensity := 'critica';
      v_deadline := CURRENT_DATE + INTERVAL '1 day'; -- Ação imediata
    ELSIF max_score >= 61 THEN
      v_overall_level := 'alto';
      v_exposure_intensity := 'alta';
      v_deadline := CURRENT_DATE + INTERVAL '30 days';
    ELSIF max_score >= 31 THEN
      v_overall_level := 'medio';
      v_exposure_intensity := 'media';
      v_deadline := CURRENT_DATE + INTERVAL '60 days';
    ELSE
      v_overall_level := 'baixo';
      v_exposure_intensity := 'baixa';
      v_deadline := CURRENT_DATE + INTERVAL '365 days';
    END IF;
  END;

  -- Identificar manifestações baseadas nos scores
  v_manifestations := jsonb_build_object(
    'alta_organizacao', CASE WHEN (v_frprt_scores->>'organizacao_trabalho')::INTEGER >= 61 THEN true ELSE false END,
    'alta_condicoes', CASE WHEN (v_frprt_scores->>'condicoes_psicossociais')::INTEGER >= 61 THEN true ELSE false END,
    'alta_relacoes', CASE WHEN (v_frprt_scores->>'relacoes_socioprofissionais')::INTEGER >= 61 THEN true ELSE false END,
    'alta_reconhecimento', CASE WHEN (v_frprt_scores->>'reconhecimento_crescimento')::INTEGER >= 61 THEN true ELSE false END,
    'alta_equilibrio', CASE WHEN (v_frprt_scores->>'equilibrio_trabalho_vida')::INTEGER >= 61 THEN true ELSE false END
  );

  -- Definir ações requeridas conforme nível
  v_required_actions := 
    CASE v_overall_level
      WHEN 'critico' THEN jsonb_build_array(
        'Intervenção imediata obrigatória',
        'Avaliação médica do funcionário',
        'Possível afastamento temporário',
        'Investigação detalhada das causas',
        'Plano de ação emergencial'
      )
      WHEN 'alto' THEN jsonb_build_array(
        'Plano de ação em 30 dias',
        'Medidas de controle específicas',
        'Monitoramento intensivo',
        'Reavaliação em 90 dias'
      )
      WHEN 'medio' THEN jsonb_build_array(
        'Medidas preventivas em 60 dias',
        'Monitoramento regular',
        'Reavaliação em 180 dias'
      )
      ELSE jsonb_build_array(
        'Manter monitoramento periódico',
        'Reavaliação anual'
      )
    END;

  -- Inserir/atualizar na tabela risk_assessments
  INSERT INTO risk_assessments (
    company_id,
    sector_id,
    role_id,
    employee_id,
    assessment_response_id,
    frprt_organizacao_trabalho,
    frprt_condicoes_psicossociais,
    frprt_relacoes_socioprofissionais,
    frprt_reconhecimento_crescimento,
    frprt_equilibrio_trabalho_vida,
    overall_risk_level,
    exposure_intensity,
    manifestations_found,
    required_actions,
    action_deadline,
    compliance_status,
    next_assessment_date
  ) VALUES (
    v_company_id,
    v_response.sector_id,
    v_response.role_id,
    v_response.employee_id,
    p_assessment_response_id,
    (v_frprt_scores->>'organizacao_trabalho')::INTEGER,
    (v_frprt_scores->>'condicoes_psicossociais')::INTEGER,
    (v_frprt_scores->>'relacoes_socioprofissionais')::INTEGER,
    (v_frprt_scores->>'reconhecimento_crescimento')::INTEGER,
    (v_frprt_scores->>'equilibrio_trabalho_vida')::INTEGER,
    v_overall_level,
    v_exposure_intensity,
    v_manifestations,
    v_required_actions,
    v_deadline,
    'pending',
    CASE v_overall_level
      WHEN 'critico' THEN CURRENT_DATE + INTERVAL '30 days'
      WHEN 'alto' THEN CURRENT_DATE + INTERVAL '90 days'
      WHEN 'medio' THEN CURRENT_DATE + INTERVAL '180 days'
      ELSE CURRENT_DATE + INTERVAL '365 days'
    END
  )
  ON CONFLICT (assessment_response_id) 
  DO UPDATE SET
    frprt_organizacao_trabalho = EXCLUDED.frprt_organizacao_trabalho,
    frprt_condicoes_psicossociais = EXCLUDED.frprt_condicoes_psicossociais,
    frprt_relacoes_socioprofissionais = EXCLUDED.frprt_relacoes_socioprofissionais,
    frprt_reconhecimento_crescimento = EXCLUDED.frprt_reconhecimento_crescimento,
    frprt_equilibrio_trabalho_vida = EXCLUDED.frprt_equilibrio_trabalho_vida,
    overall_risk_level = EXCLUDED.overall_risk_level,
    exposure_intensity = EXCLUDED.exposure_intensity,
    manifestations_found = EXCLUDED.manifestations_found,
    required_actions = EXCLUDED.required_actions,
    action_deadline = EXCLUDED.action_deadline,
    updated_at = now();

  -- Retornar resultado da classificação
  RETURN jsonb_build_object(
    'success', true,
    'assessment_id', p_assessment_response_id,
    'company_id', v_company_id,
    'employee_name', v_response.employee_name,
    'overall_level', v_overall_level,
    'exposure_intensity', v_exposure_intensity,
    'frprt_scores', v_frprt_scores,
    'manifestations', v_manifestations,
    'required_actions', v_required_actions,
    'action_deadline', v_deadline
  );
END;
$$;

-- 5. Trigger para processar automaticamente assessments completados
CREATE OR REPLACE FUNCTION public.trigger_frprt_processing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Processar automaticamente quando uma avaliação é completada
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    -- Processar classificação FRPRT
    PERFORM process_frprt_classification(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS trigger_frprt_auto_processing ON assessment_responses;
CREATE TRIGGER trigger_frprt_auto_processing
  AFTER UPDATE ON assessment_responses
  FOR EACH ROW
  EXECUTE FUNCTION trigger_frprt_processing();

-- 6. Função para calcular métricas da empresa
CREATE OR REPLACE FUNCTION public.calculate_company_frprt_metrics(
  p_company_id UUID,
  p_sector_id UUID DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_metrics RECORD;
  v_result JSONB;
BEGIN
  -- Calcular métricas FRPRT
  SELECT 
    COUNT(*) as total_assessments,
    COUNT(CASE WHEN frprt_organizacao_trabalho >= 61 THEN 1 END) as org_alto,
    COUNT(CASE WHEN frprt_condicoes_psicossociais >= 61 THEN 1 END) as cond_alto,
    COUNT(CASE WHEN frprt_relacoes_socioprofissionais >= 61 THEN 1 END) as rel_alto,
    COUNT(CASE WHEN frprt_reconhecimento_crescimento >= 61 THEN 1 END) as rec_alto,
    COUNT(CASE WHEN frprt_equilibrio_trabalho_vida >= 61 THEN 1 END) as eq_alto,
    COUNT(CASE WHEN overall_risk_level = 'baixo' THEN 1 END) as baixa,
    COUNT(CASE WHEN overall_risk_level = 'medio' THEN 1 END) as media,
    COUNT(CASE WHEN overall_risk_level = 'alto' THEN 1 END) as alta,
    COUNT(CASE WHEN overall_risk_level = 'critico' THEN 1 END) as critica,
    COUNT(CASE WHEN compliance_status = 'completed' THEN 1 END) as completed_actions,
    COUNT(CASE WHEN action_deadline < CURRENT_DATE AND compliance_status != 'completed' THEN 1 END) as overdue
  INTO v_metrics
  FROM risk_assessments 
  WHERE company_id = p_company_id
    AND (p_sector_id IS NULL OR sector_id = p_sector_id)
    AND created_at >= CURRENT_DATE - INTERVAL '30 days';

  -- Inserir/atualizar métricas
  INSERT INTO psychosocial_metrics (
    company_id,
    sector_id,
    calculation_date,
    total_assessments,
    frprt_organizacao_alto,
    frprt_condicoes_alto,
    frprt_relacoes_alto,
    frprt_reconhecimento_alto,
    frprt_equilibrio_alto,
    exposicao_baixa,
    exposicao_media,
    exposicao_alta,
    exposicao_critica,
    compliance_rate,
    pending_actions,
    overdue_actions
  ) VALUES (
    p_company_id,
    p_sector_id,
    CURRENT_DATE,
    COALESCE(v_metrics.total_assessments, 0),
    COALESCE(v_metrics.org_alto, 0),
    COALESCE(v_metrics.cond_alto, 0),
    COALESCE(v_metrics.rel_alto, 0),
    COALESCE(v_metrics.rec_alto, 0),
    COALESCE(v_metrics.eq_alto, 0),
    COALESCE(v_metrics.baixa, 0),
    COALESCE(v_metrics.media, 0),
    COALESCE(v_metrics.alta, 0),
    COALESCE(v_metrics.critica, 0),
    CASE WHEN v_metrics.total_assessments > 0 
      THEN (v_metrics.completed_actions::NUMERIC / v_metrics.total_assessments * 100)
      ELSE 0 
    END,
    COALESCE(v_metrics.total_assessments - v_metrics.completed_actions, 0),
    COALESCE(v_metrics.overdue, 0)
  )
  ON CONFLICT (company_id, COALESCE(sector_id, '00000000-0000-0000-0000-000000000000'::UUID), calculation_date)
  DO UPDATE SET
    total_assessments = EXCLUDED.total_assessments,
    frprt_organizacao_alto = EXCLUDED.frprt_organizacao_alto,
    frprt_condicoes_alto = EXCLUDED.frprt_condicoes_alto,
    frprt_relacoes_alto = EXCLUDED.frprt_relacoes_alto,
    frprt_reconhecimento_alto = EXCLUDED.frprt_reconhecimento_alto,
    frprt_equilibrio_alto = EXCLUDED.frprt_equilibrio_alto,
    exposicao_baixa = EXCLUDED.exposicao_baixa,
    exposicao_media = EXCLUDED.exposicao_media,
    exposicao_alta = EXCLUDED.exposicao_alta,
    exposicao_critica = EXCLUDED.exposicao_critica,
    compliance_rate = EXCLUDED.compliance_rate,
    pending_actions = EXCLUDED.pending_actions,
    overdue_actions = EXCLUDED.overdue_actions;

  v_result := jsonb_build_object(
    'company_id', p_company_id,
    'sector_id', p_sector_id,
    'metrics', v_metrics,
    'updated_at', now()
  );

  RETURN v_result;
END;
$$;