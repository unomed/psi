
-- Criar tabela para logs de humor dos funcionários
CREATE TABLE public.employee_mood_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 5),
  mood_emoji TEXT NOT NULL,
  mood_description TEXT NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, log_date)
);

-- Criar índices para otimizar consultas
CREATE INDEX idx_employee_mood_logs_employee_date ON public.employee_mood_logs(employee_id, log_date DESC);
CREATE INDEX idx_employee_mood_logs_date ON public.employee_mood_logs(log_date DESC);

-- Habilitar RLS
ALTER TABLE public.employee_mood_logs ENABLE ROW LEVEL SECURITY;

-- Política para funcionários verem apenas seus próprios logs
CREATE POLICY "Employees can view their own mood logs" 
  ON public.employee_mood_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = employee_id 
      AND e.cpf = current_setting('app.current_employee_cpf', true)
    )
  );

-- Política para funcionários criarem seus próprios logs
CREATE POLICY "Employees can create their own mood logs" 
  ON public.employee_mood_logs 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = employee_id 
      AND e.cpf = current_setting('app.current_employee_cpf', true)
    )
  );

-- Política para funcionários atualizarem seus próprios logs
CREATE POLICY "Employees can update their own mood logs" 
  ON public.employee_mood_logs 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = employee_id 
      AND e.cpf = current_setting('app.current_employee_cpf', true)
    )
  );

-- Política para usuários autenticados (empresa) verem todos os logs de suas empresas
CREATE POLICY "Authenticated users can view company mood logs" 
  ON public.employee_mood_logs 
  FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = employee_id 
      AND public.user_has_company_access(e.company_id, auth.uid())
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_employee_mood_logs_updated_at
  BEFORE UPDATE ON public.employee_mood_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para autenticar funcionário por CPF
CREATE OR REPLACE FUNCTION public.authenticate_employee(p_cpf TEXT, p_password TEXT)
RETURNS TABLE(
  employee_id UUID,
  employee_name TEXT,
  company_id UUID,
  company_name TEXT,
  is_valid BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  employee_record RECORD;
  cpf_last_4 TEXT;
BEGIN
  -- Extrair últimos 4 dígitos do CPF
  cpf_last_4 := RIGHT(REGEXP_REPLACE(p_cpf, '[^0-9]', '', 'g'), 4);
  
  -- Buscar funcionário pelo CPF
  SELECT e.id, e.name, e.company_id, c.name as company_name
  INTO employee_record
  FROM employees e
  JOIN companies c ON e.company_id = c.id
  WHERE REGEXP_REPLACE(e.cpf, '[^0-9]', '', 'g') = REGEXP_REPLACE(p_cpf, '[^0-9]', '', 'g')
  AND e.status = 'active';
  
  -- Verificar se funcionário existe e senha está correta
  IF employee_record.id IS NOT NULL AND p_password = cpf_last_4 THEN
    RETURN QUERY SELECT 
      employee_record.id,
      employee_record.name,
      employee_record.company_id,
      employee_record.company_name,
      true;
  ELSE
    RETURN QUERY SELECT 
      NULL::UUID,
      NULL::TEXT,
      NULL::UUID,
      NULL::TEXT,
      false;
  END IF;
END;
$$;

-- Função para obter avaliações pendentes do funcionário
CREATE OR REPLACE FUNCTION public.get_employee_pending_assessments(p_employee_id UUID)
RETURNS TABLE(
  assessment_id UUID,
  template_title TEXT,
  template_description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  link_url TEXT,
  days_remaining INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.id,
    ct.title,
    ct.description,
    sa.scheduled_date,
    sa.link_url,
    EXTRACT(DAY FROM (sa.scheduled_date - now()))::INTEGER as days_remaining
  FROM scheduled_assessments sa
  JOIN checklist_templates ct ON sa.template_id = ct.id
  WHERE sa.employee_id = p_employee_id
  AND sa.status IN ('scheduled', 'sent')
  AND sa.completed_at IS NULL
  ORDER BY sa.scheduled_date ASC;
END;
$$;

-- Função para obter estatísticas de humor do funcionário
CREATE OR REPLACE FUNCTION public.get_employee_mood_stats(p_employee_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE(
  avg_mood NUMERIC,
  mood_trend TEXT,
  total_logs INTEGER,
  mood_distribution JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_avg NUMERIC;
  previous_avg NUMERIC;
  trend TEXT;
BEGIN
  -- Média atual
  SELECT AVG(mood_score) INTO current_avg
  FROM employee_mood_logs
  WHERE employee_id = p_employee_id
  AND log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL;
  
  -- Média anterior (mesmo período anterior)
  SELECT AVG(mood_score) INTO previous_avg
  FROM employee_mood_logs
  WHERE employee_id = p_employee_id
  AND log_date >= CURRENT_DATE - (p_days * 2 || ' days')::INTERVAL
  AND log_date < CURRENT_DATE - (p_days || ' days')::INTERVAL;
  
  -- Determinar tendência
  IF current_avg > previous_avg THEN
    trend := 'melhorando';
  ELSIF current_avg < previous_avg THEN
    trend := 'piorando';
  ELSE
    trend := 'estável';
  END IF;
  
  RETURN QUERY
  SELECT 
    current_avg,
    trend,
    COUNT(*)::INTEGER as total_logs,
    jsonb_object_agg(mood_score::TEXT, count) as mood_distribution
  FROM (
    SELECT 
      mood_score,
      COUNT(*) as count
    FROM employee_mood_logs
    WHERE employee_id = p_employee_id
    AND log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY mood_score
  ) mood_counts;
END;
$$;
