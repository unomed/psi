
-- Corrigir vulnerabilidades restantes de Function Search Path Mutable
-- Corrigido: usar CREATE OR REPLACE para função de trigger

-- 1. Corrigir get_action_plans
DROP FUNCTION IF EXISTS public.get_action_plans();

CREATE OR REPLACE FUNCTION public.get_action_plans()
RETURNS TABLE(
  id uuid, 
  company_id uuid, 
  assessment_response_id uuid, 
  title text, 
  description text, 
  status text, 
  priority text, 
  responsible_user_id uuid, 
  sector_id uuid,
  sector_name text,
  start_date date, 
  due_date date, 
  completion_date date, 
  progress_percentage integer, 
  risk_level text, 
  budget_allocated numeric, 
  budget_used numeric, 
  created_by uuid, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ap.id,
    ap.company_id,
    ap.assessment_response_id,
    ap.title,
    ap.description,
    ap.status,
    ap.priority,
    ap.responsible_user_id,
    ap.sector_id,
    s.name as sector_name,
    ap.start_date,
    ap.due_date,
    ap.completion_date,
    ap.progress_percentage,
    ap.risk_level,
    ap.budget_allocated,
    ap.budget_used,
    ap.created_by,
    ap.created_at,
    ap.updated_at
  FROM action_plans ap
  LEFT JOIN sectors s ON ap.sector_id = s.id
  ORDER BY ap.created_at DESC;
END;
$function$;

-- 2. Corrigir update_risk_matrix_updated_at (usando CREATE OR REPLACE)
CREATE OR REPLACE FUNCTION public.update_risk_matrix_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3. Corrigir calculate_risk_level
DROP FUNCTION IF EXISTS public.calculate_risk_level(uuid, integer, integer);

CREATE OR REPLACE FUNCTION public.calculate_risk_level(p_company_id uuid, p_severity_index integer, p_probability_index integer)
RETURNS TABLE(risk_value integer, risk_level text, recommended_action text, risk_color text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  matrix_config RECORD;
  calculated_risk integer;
  max_value integer;
  action_index integer;
  risk_action RECORD;
BEGIN
  -- Buscar configuração da matriz para a empresa
  SELECT * INTO matrix_config 
  FROM risk_matrix_configurations 
  WHERE company_id = p_company_id AND is_active = true
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Se não encontrar configuração da empresa, usar padrão
  IF matrix_config IS NULL THEN
    SELECT * INTO matrix_config 
    FROM risk_matrix_configurations 
    WHERE company_id IS NULL AND is_active = true
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;
  
  -- Se ainda não encontrar, retornar valores padrão
  IF matrix_config IS NULL THEN
    RETURN QUERY SELECT 1, 'Baixo'::text, 'Reter'::text, '#F2FCE2'::text;
    RETURN;
  END IF;
  
  -- Calcular valor de risco baseado na matriz
  calculated_risk := (matrix_config.risk_matrix->p_severity_index->p_probability_index)::integer;
  max_value := matrix_config.matrix_size * matrix_config.matrix_size;
  
  -- Determinar índice da ação baseado no valor
  IF calculated_risk <= max_value / 3 THEN
    action_index := 0;
  ELSIF calculated_risk <= (2 * max_value) / 3 THEN
    action_index := 1;
  ELSIF calculated_risk < max_value THEN
    action_index := 2;
  ELSE
    action_index := 3;
  END IF;
  
  -- Garantir que o índice existe no array de ações
  IF action_index >= jsonb_array_length(matrix_config.risk_actions) THEN
    action_index := jsonb_array_length(matrix_config.risk_actions) - 1;
  END IF;
  
  -- Obter ação de risco
  SELECT * INTO risk_action FROM jsonb_to_record(matrix_config.risk_actions->action_index) 
  AS x(level text, action text, color text);
  
  RETURN QUERY SELECT 
    calculated_risk,
    COALESCE(risk_action.level, 'Indefinido'),
    COALESCE(risk_action.action, 'Avaliar'),
    COALESCE(risk_action.color, '#F2FCE2');
END;
$function$;

-- 4. Corrigir get_risk_assessments_by_company
DROP FUNCTION IF EXISTS public.get_risk_assessments_by_company(uuid);

CREATE OR REPLACE FUNCTION public.get_risk_assessments_by_company(p_company_id uuid DEFAULT NULL::uuid)
RETURNS TABLE(
  id uuid, 
  company_id uuid, 
  company_name text, 
  employee_id uuid, 
  employee_name text, 
  sector_id uuid, 
  sector_name text, 
  role_id uuid, 
  role_name text, 
  assessment_response_id uuid, 
  severity_index integer, 
  probability_index integer, 
  risk_value integer, 
  risk_level text, 
  recommended_action text, 
  risk_factors jsonb, 
  mitigation_actions jsonb, 
  status text, 
  next_assessment_date date, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ra.id,
    ra.company_id,
    c.name as company_name,
    ra.employee_id,
    e.name as employee_name,
    ra.sector_id,
    s.name as sector_name,
    ra.role_id,
    r.name as role_name,
    ra.assessment_response_id,
    ra.severity_index,
    ra.probability_index,
    ra.risk_value,
    ra.risk_level,
    ra.recommended_action,
    ra.risk_factors,
    ra.mitigation_actions,
    ra.status,
    ra.next_assessment_date,
    ra.created_at,
    ra.updated_at
  FROM risk_assessments ra
  LEFT JOIN companies c ON ra.company_id = c.id
  LEFT JOIN employees e ON ra.employee_id = e.id
  LEFT JOIN sectors s ON ra.sector_id = s.id
  LEFT JOIN roles r ON ra.role_id = r.id
  WHERE (p_company_id IS NULL OR ra.company_id = p_company_id)
  ORDER BY ra.created_at DESC;
END;
$function$;

-- 5. Corrigir calculate_psychosocial_risk
DROP FUNCTION IF EXISTS public.calculate_psychosocial_risk(uuid, uuid);

CREATE OR REPLACE FUNCTION public.calculate_psychosocial_risk(p_assessment_response_id uuid, p_company_id uuid)
RETURNS TABLE(category psychosocial_risk_category, risk_score numeric, exposure_level psychosocial_exposure_level, recommended_actions jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  response_data jsonb;
  criteria_rec RECORD;
  calculated_score numeric;
  exposure_lvl psychosocial_exposure_level;
  actions jsonb;
BEGIN
  -- Buscar dados da resposta de avaliação
  SELECT response_data INTO response_data 
  FROM assessment_responses 
  WHERE id = p_assessment_response_id;
  
  -- Para cada categoria de risco psicossocial
  FOR criteria_rec IN 
    SELECT DISTINCT category, threshold_low, threshold_medium, threshold_high, mandatory_actions
    FROM psychosocial_criteria 
    WHERE company_id = p_company_id OR company_id IS NULL
    AND is_active = true
  LOOP
    -- Calcular score baseado nas respostas (simulação - deve ser adaptado conforme estrutura real)
    calculated_score := (response_data->>'total_score')::numeric;
    
    -- Determinar nível de exposição
    IF calculated_score <= criteria_rec.threshold_low THEN
      exposure_lvl := 'baixo';
      actions := '["Manter monitoramento periódico"]'::jsonb;
    ELSIF calculated_score <= criteria_rec.threshold_medium THEN
      exposure_lvl := 'medio';
      actions := '["Implementar medidas preventivas", "Aumentar frequência de monitoramento"]'::jsonb;
    ELSIF calculated_score <= criteria_rec.threshold_high THEN
      exposure_lvl := 'alto';
      actions := criteria_rec.mandatory_actions;
    ELSE
      exposure_lvl := 'critico';
      actions := jsonb_build_array('Implementar medidas de controle imediatas', 'Afastamento temporário se necessário') || criteria_rec.mandatory_actions;
    END IF;
    
    RETURN QUERY SELECT 
      criteria_rec.category,
      calculated_score,
      exposure_lvl,
      actions;
  END LOOP;
END;
$function$;

-- 6. Corrigir generate_nr01_action_plan
DROP FUNCTION IF EXISTS public.generate_nr01_action_plan(uuid);

CREATE OR REPLACE FUNCTION public.generate_nr01_action_plan(p_risk_analysis_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  risk_analysis RECORD;
  template_rec RECORD;
  new_plan_id uuid;
  plan_title text;
BEGIN
  -- Buscar análise de risco
  SELECT * INTO risk_analysis
  FROM psychosocial_risk_analysis
  WHERE id = p_risk_analysis_id;
  
  -- Buscar template de ação apropriado
  SELECT * INTO template_rec
  FROM nr01_action_templates
  WHERE category = risk_analysis.category
  AND exposure_level = risk_analysis.exposure_level
  ORDER BY is_mandatory DESC, created_at DESC
  LIMIT 1;
  
  IF template_rec IS NULL THEN
    RAISE EXCEPTION 'Template de ação não encontrado para categoria % e nível %', 
      risk_analysis.category, risk_analysis.exposure_level;
  END IF;
  
  -- Criar título do plano
  plan_title := format('NR-01: %s - Nível %s', 
    template_rec.template_name, 
    UPPER(risk_analysis.exposure_level::text));
  
  -- Criar plano de ação
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
    risk_analysis.company_id,
    plan_title,
    template_rec.description || E'\n\nBaseado na análise de risco psicossocial conforme NR-01.',
    'draft',
    CASE 
      WHEN risk_analysis.exposure_level IN ('alto', 'critico') THEN 'high'
      WHEN risk_analysis.exposure_level = 'medio' THEN 'medium'
      ELSE 'low'
    END,
    risk_analysis.sector_id,
    current_date,
    current_date + interval '1 day' * COALESCE(template_rec.recommended_timeline_days, 90),
    risk_analysis.exposure_level::text,
    risk_analysis.created_by
  ) RETURNING id INTO new_plan_id;
  
  RETURN new_plan_id;
END;
$function$;
