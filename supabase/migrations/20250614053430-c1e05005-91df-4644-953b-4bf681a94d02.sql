
-- Corrigir vulnerabilidades de Function Search Path Mutable
-- Adicionar SET search_path TO 'public' nas funções vulneráveis

-- 1. Corrigir get_action_plan_items
DROP FUNCTION IF EXISTS public.get_action_plan_items(uuid);

CREATE OR REPLACE FUNCTION public.get_action_plan_items(plan_id uuid)
RETURNS TABLE(
  id uuid, 
  action_plan_id uuid, 
  title text, 
  description text, 
  status text, 
  priority text, 
  responsible_name text, 
  responsible_email text, 
  department text, 
  estimated_hours integer, 
  actual_hours integer, 
  start_date date, 
  due_date date, 
  completion_date date, 
  progress_percentage integer, 
  dependencies text[], 
  notes text, 
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
  SELECT api.*
  FROM action_plan_items api
  WHERE api.action_plan_id = plan_id
  ORDER BY api.created_at ASC;
END;
$function$;

-- 2. Corrigir create_action_plan
DROP FUNCTION IF EXISTS public.create_action_plan(jsonb);

CREATE OR REPLACE FUNCTION public.create_action_plan(plan_data jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_plan_id uuid;
BEGIN
  INSERT INTO action_plans (
    company_id,
    assessment_response_id,
    title,
    description,
    status,
    priority,
    responsible_user_id,
    sector_id,
    start_date,
    due_date,
    risk_level,
    budget_allocated,
    created_by
  ) VALUES (
    (plan_data->>'company_id')::uuid,
    (plan_data->>'assessment_response_id')::uuid,
    plan_data->>'title',
    plan_data->>'description',
    COALESCE(plan_data->>'status', 'draft'),
    COALESCE(plan_data->>'priority', 'medium'),
    (plan_data->>'responsible_user_id')::uuid,
    (plan_data->>'sector_id')::uuid,
    (plan_data->>'start_date')::date,
    (plan_data->>'due_date')::date,
    plan_data->>'risk_level',
    (plan_data->>'budget_allocated')::numeric,
    (plan_data->>'created_by')::uuid
  ) RETURNING id INTO new_plan_id;
  
  RETURN new_plan_id;
END;
$function$;

-- 3. Corrigir update_action_plan
DROP FUNCTION IF EXISTS public.update_action_plan(uuid, jsonb);

CREATE OR REPLACE FUNCTION public.update_action_plan(plan_id uuid, plan_data jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE action_plans SET
    title = COALESCE(plan_data->>'title', title),
    description = COALESCE(plan_data->>'description', description),
    status = COALESCE(plan_data->>'status', status),
    priority = COALESCE(plan_data->>'priority', priority),
    responsible_user_id = COALESCE((plan_data->>'responsible_user_id')::uuid, responsible_user_id),
    sector_id = COALESCE((plan_data->>'sector_id')::uuid, sector_id),
    start_date = COALESCE((plan_data->>'start_date')::date, start_date),
    due_date = COALESCE((plan_data->>'due_date')::date, due_date),
    completion_date = COALESCE((plan_data->>'completion_date')::date, completion_date),
    risk_level = COALESCE(plan_data->>'risk_level', risk_level),
    budget_allocated = COALESCE((plan_data->>'budget_allocated')::numeric, budget_allocated),
    budget_used = COALESCE((plan_data->>'budget_used')::numeric, budget_used),
    updated_at = now()
  WHERE id = plan_id;
  
  RETURN plan_id;
END;
$function$;

-- 4. Verificar e corrigir outras funções relacionadas para consistência
DROP FUNCTION IF EXISTS public.create_action_plan_item(jsonb);

CREATE OR REPLACE FUNCTION public.create_action_plan_item(item_data jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_item_id uuid;
BEGIN
  INSERT INTO action_plan_items (
    action_plan_id,
    title,
    description,
    status,
    priority,
    responsible_name,
    responsible_email,
    department,
    estimated_hours,
    start_date,
    due_date,
    notes,
    created_by
  ) VALUES (
    (item_data->>'action_plan_id')::uuid,
    item_data->>'title',
    item_data->>'description',
    COALESCE(item_data->>'status', 'pending'),
    COALESCE(item_data->>'priority', 'medium'),
    item_data->>'responsible_name',
    item_data->>'responsible_email',
    item_data->>'department',
    (item_data->>'estimated_hours')::integer,
    (item_data->>'start_date')::date,
    (item_data->>'due_date')::date,
    item_data->>'notes',
    (item_data->>'created_by')::uuid
  ) RETURNING id INTO new_item_id;
  
  RETURN new_item_id;
END;
$function$;

-- 5. Corrigir update_action_plan_item
DROP FUNCTION IF EXISTS public.update_action_plan_item(uuid, jsonb);

CREATE OR REPLACE FUNCTION public.update_action_plan_item(item_id uuid, item_data jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE action_plan_items SET
    title = COALESCE(item_data->>'title', title),
    description = COALESCE(item_data->>'description', description),
    status = COALESCE(item_data->>'status', status),
    priority = COALESCE(item_data->>'priority', priority),
    responsible_name = COALESCE(item_data->>'responsible_name', responsible_name),
    responsible_email = COALESCE(item_data->>'responsible_email', responsible_email),
    department = COALESCE(item_data->>'department', department),
    estimated_hours = COALESCE((item_data->>'estimated_hours')::integer, estimated_hours),
    actual_hours = COALESCE((item_data->>'actual_hours')::integer, actual_hours),
    start_date = COALESCE((item_data->>'start_date')::date, start_date),
    due_date = COALESCE((item_data->>'due_date')::date, due_date),
    completion_date = COALESCE((item_data->>'completion_date')::date, completion_date),
    progress_percentage = COALESCE((item_data->>'progress_percentage')::integer, progress_percentage),
    notes = COALESCE(item_data->>'notes', notes),
    updated_at = now()
  WHERE id = item_id;
  
  RETURN item_id;
END;
$function$;

-- 6. Corrigir delete_action_plan
DROP FUNCTION IF EXISTS public.delete_action_plan(uuid);

CREATE OR REPLACE FUNCTION public.delete_action_plan(plan_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM action_plans WHERE id = plan_id;
END;
$function$;

-- 7. Corrigir delete_action_plan_item
DROP FUNCTION IF EXISTS public.delete_action_plan_item(uuid);

CREATE OR REPLACE FUNCTION public.delete_action_plan_item(item_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM action_plan_items WHERE id = item_id;
END;
$function$;
