
-- Criar tabela para armazenar configurações da matriz de risco
CREATE TABLE IF NOT EXISTS public.risk_matrix_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  matrix_size integer NOT NULL DEFAULT 3,
  row_labels jsonb NOT NULL DEFAULT '[]'::jsonb,
  col_labels jsonb NOT NULL DEFAULT '[]'::jsonb,
  risk_matrix jsonb NOT NULL DEFAULT '[]'::jsonb,
  risk_actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para análises de risco automáticas
CREATE TABLE IF NOT EXISTS public.risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id),
  employee_id uuid REFERENCES public.employees(id),
  sector_id uuid REFERENCES public.sectors(id),
  role_id uuid REFERENCES public.roles(id),
  assessment_response_id uuid REFERENCES public.assessment_responses(id),
  severity_index integer NOT NULL,
  probability_index integer NOT NULL,
  risk_value integer NOT NULL,
  risk_level text NOT NULL,
  recommended_action text,
  risk_factors jsonb DEFAULT '[]'::jsonb,
  mitigation_actions jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'identified',
  next_assessment_date date,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_risk_matrix_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_risk_matrix_configurations_updated_at
  BEFORE UPDATE ON public.risk_matrix_configurations
  FOR EACH ROW EXECUTE FUNCTION update_risk_matrix_updated_at();

CREATE TRIGGER update_risk_assessments_updated_at
  BEFORE UPDATE ON public.risk_assessments
  FOR EACH ROW EXECUTE FUNCTION update_risk_matrix_updated_at();

-- Função para calcular risco baseado na matriz
CREATE OR REPLACE FUNCTION public.calculate_risk_level(
  p_company_id uuid,
  p_severity_index integer,
  p_probability_index integer
)
RETURNS TABLE(
  risk_value integer,
  risk_level text,
  recommended_action text,
  risk_color text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  matrix_config RECORD;
  calculated_risk integer;
  max_value integer;
  action_index integer;
  risk_action RECORD;
BEGIN
  -- Buscar configuração da matriz para a empresa
  SELECT * INTO matrix_config 
  FROM public.risk_matrix_configurations 
  WHERE company_id = p_company_id AND is_active = true
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Se não encontrar configuração da empresa, usar padrão
  IF matrix_config IS NULL THEN
    SELECT * INTO matrix_config 
    FROM public.risk_matrix_configurations 
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
$$;

-- Função para obter avaliações de risco por empresa
CREATE OR REPLACE FUNCTION public.get_risk_assessments_by_company(p_company_id uuid DEFAULT NULL)
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
AS $$
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
$$;
