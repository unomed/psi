
-- Corrigir vulnerabilidades de Function Search Path Mutable
-- Adicionar SET search_path TO 'public' nas funções SECURITY DEFINER

-- 1. Corrigir validate_employee_required_tags
CREATE OR REPLACE FUNCTION public.validate_employee_required_tags()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    role_required_tags jsonb;
    missing_tags jsonb;
BEGIN
    -- Só validar para funcionários, não para candidatos
    IF NEW.employee_type = 'funcionario' THEN
        -- Buscar tags obrigatórias da função
        SELECT required_tags INTO role_required_tags
        FROM roles 
        WHERE id = NEW.role_id;
        
        -- Se há tags obrigatórias, verificar se o funcionário as possui
        IF role_required_tags IS NOT NULL AND jsonb_array_length(role_required_tags) > 0 THEN
            -- Encontrar tags em falta
            SELECT jsonb_agg(tag) INTO missing_tags
            FROM jsonb_array_elements_text(role_required_tags) AS tag
            WHERE NOT (NEW.employee_tags ? tag);
            
            -- Se há tags em falta, gerar erro
            IF missing_tags IS NOT NULL AND jsonb_array_length(missing_tags) > 0 THEN
                RAISE EXCEPTION 'Funcionário não possui as seguintes tags obrigatórias para esta função: %', missing_tags::text;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- 2. Corrigir migrate_employee_tags_from_jsonb
CREATE OR REPLACE FUNCTION public.migrate_employee_tags_from_jsonb()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  emp_record RECORD;
  tag_name TEXT;
  tag_type_id UUID;
BEGIN
  -- Migrar tags dos funcionários
  FOR emp_record IN 
    SELECT id, employee_tags 
    FROM employees 
    WHERE employee_tags IS NOT NULL 
    AND jsonb_array_length(employee_tags) > 0
  LOOP
    -- Para cada tag no array JSONB
    FOR tag_name IN 
      SELECT jsonb_array_elements_text(emp_record.employee_tags)
    LOOP
      -- Buscar ou criar o tipo de tag
      SELECT id INTO tag_type_id 
      FROM employee_tag_types 
      WHERE name = tag_name;
      
      -- Se não existir, criar
      IF tag_type_id IS NULL THEN
        INSERT INTO employee_tag_types (name, category) 
        VALUES (tag_name, 'skill') 
        RETURNING id INTO tag_type_id;
      END IF;
      
      -- Inserir associação funcionário-tag
      INSERT INTO employee_tags (employee_id, tag_type_id)
      VALUES (emp_record.id, tag_type_id)
      ON CONFLICT (employee_id, tag_type_id) DO NOTHING;
    END LOOP;
  END LOOP;
  
  -- Migrar tags obrigatórias das funções
  FOR emp_record IN 
    SELECT id, required_tags 
    FROM roles 
    WHERE required_tags IS NOT NULL 
    AND jsonb_array_length(required_tags) > 0
  LOOP
    -- Para cada tag obrigatória
    FOR tag_name IN 
      SELECT jsonb_array_elements_text(emp_record.required_tags)
    LOOP
      -- Buscar ou criar o tipo de tag
      SELECT id INTO tag_type_id 
      FROM employee_tag_types 
      WHERE name = tag_name;
      
      -- Se não existir, criar
      IF tag_type_id IS NULL THEN
        INSERT INTO employee_tag_types (name, category) 
        VALUES (tag_name, 'requirement') 
        RETURNING id INTO tag_type_id;
      END IF;
      
      -- Inserir como tag obrigatória da função
      INSERT INTO role_required_tags (role_id, tag_type_id)
      VALUES (emp_record.id, tag_type_id)
      ON CONFLICT (role_id, tag_type_id) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$function$;

-- 3. Corrigir get_employee_tags
CREATE OR REPLACE FUNCTION public.get_employee_tags(p_employee_id uuid)
RETURNS TABLE(tag_id uuid, tag_name text, tag_description text, tag_category text, acquired_date date, expiry_date date)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ett.id,
    ett.name,
    ett.description,
    ett.category,
    et.acquired_date,
    et.expiry_date
  FROM employee_tags et
  JOIN employee_tag_types ett ON et.tag_type_id = ett.id
  WHERE et.employee_id = p_employee_id
  AND ett.is_active = true
  ORDER BY ett.name;
END;
$function$;

-- 4. Corrigir get_role_required_tags
CREATE OR REPLACE FUNCTION public.get_role_required_tags(p_role_id uuid)
RETURNS TABLE(tag_id uuid, tag_name text, tag_description text, is_mandatory boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ett.id,
    ett.name,
    ett.description,
    rrt.is_mandatory
  FROM role_required_tags rrt
  JOIN employee_tag_types ett ON rrt.tag_type_id = ett.id
  WHERE rrt.role_id = p_role_id
  AND ett.is_active = true
  ORDER BY ett.name;
END;
$function$;

-- 5. Corrigir validate_employee_required_tags_relational
CREATE OR REPLACE FUNCTION public.validate_employee_required_tags_relational()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    missing_tags TEXT[];
    required_tag_names TEXT[];
    employee_tag_names TEXT[];
BEGIN
    -- Só validar para funcionários, não para candidatos
    IF NEW.employee_type = 'funcionario' THEN
        -- Buscar nomes das tags obrigatórias da função
        SELECT array_agg(ett.name) INTO required_tag_names
        FROM role_required_tags rrt
        JOIN employee_tag_types ett ON rrt.tag_type_id = ett.id
        WHERE rrt.role_id = NEW.role_id
        AND rrt.is_mandatory = true
        AND ett.is_active = true;
        
        -- Se há tags obrigatórias
        IF required_tag_names IS NOT NULL AND array_length(required_tag_names, 1) > 0 THEN
            -- Buscar tags que o funcionário possui
            SELECT array_agg(ett.name) INTO employee_tag_names
            FROM employee_tags et
            JOIN employee_tag_types ett ON et.tag_type_id = ett.id
            WHERE et.employee_id = NEW.id
            AND ett.is_active = true;
            
            -- Encontrar tags em falta
            SELECT array_agg(tag) INTO missing_tags
            FROM unnest(required_tag_names) AS tag
            WHERE NOT (tag = ANY(COALESCE(employee_tag_names, ARRAY[]::TEXT[])));
            
            -- Se há tags em falta, gerar erro
            IF missing_tags IS NOT NULL AND array_length(missing_tags, 1) > 0 THEN
                RAISE EXCEPTION 'Funcionário não possui as seguintes tags obrigatórias para esta função: %', array_to_string(missing_tags, ', ');
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- 6. Corrigir create_audit_log
CREATE OR REPLACE FUNCTION public.create_audit_log(
  p_action_type audit_action_type, 
  p_module audit_module, 
  p_resource_type text DEFAULT NULL::text, 
  p_resource_id text DEFAULT NULL::text, 
  p_description text DEFAULT ''::text, 
  p_old_values jsonb DEFAULT NULL::jsonb, 
  p_new_values jsonb DEFAULT NULL::jsonb, 
  p_company_id uuid DEFAULT NULL::uuid, 
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action_type,
    module,
    resource_type,
    resource_id,
    description,
    old_values,
    new_values,
    company_id,
    metadata
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_module,
    p_resource_type,
    p_resource_id,
    p_description,
    p_old_values,
    p_new_values,
    p_company_id,
    p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$function$;

-- Comentários de documentação
COMMENT ON FUNCTION public.validate_employee_required_tags() IS 
'Trigger function para validar tags obrigatórias dos funcionários - Corrigido para search_path seguro';

COMMENT ON FUNCTION public.migrate_employee_tags_from_jsonb() IS 
'Função para migrar tags de JSONB para tabelas relacionais - Corrigido para search_path seguro';

COMMENT ON FUNCTION public.get_employee_tags(uuid) IS 
'Função para buscar tags de um funcionário específico - Corrigido para search_path seguro';

COMMENT ON FUNCTION public.get_role_required_tags(uuid) IS 
'Função para buscar tags obrigatórias de uma função - Corrigido para search_path seguro';

COMMENT ON FUNCTION public.validate_employee_required_tags_relational() IS 
'Trigger function para validar tags obrigatórias usando relacionamentos - Corrigido para search_path seguro';

COMMENT ON FUNCTION public.create_audit_log(audit_action_type, audit_module, text, text, text, jsonb, jsonb, uuid, jsonb) IS 
'Função para criar logs de auditoria - Corrigido para search_path seguro';
