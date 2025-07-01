
-- Remover a função existente
DROP FUNCTION IF EXISTS public.get_action_plans();

-- Recriar a função com o novo formato incluindo sector_name
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
