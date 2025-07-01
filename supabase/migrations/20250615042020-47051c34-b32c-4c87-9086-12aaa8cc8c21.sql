
-- Função para buscar avaliações pendentes de um funcionário
CREATE OR REPLACE FUNCTION public.get_employee_pending_assessments(p_employee_id uuid)
 RETURNS TABLE(assessment_id uuid, template_title text, template_description text, scheduled_date timestamp with time zone, link_url text, days_remaining integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Função para buscar estatísticas de humor de um funcionário
CREATE OR REPLACE FUNCTION public.get_employee_mood_stats(p_employee_id uuid, p_days integer DEFAULT 30)
 RETURNS TABLE(avg_mood numeric, mood_trend text, total_logs integer, mood_distribution jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;
