-- Corrigir função authenticate_employee para incluir SET search_path
CREATE OR REPLACE FUNCTION public.authenticate_employee(p_cpf text, p_password text)
 RETURNS TABLE(employee_id uuid, employee_name text, company_id uuid, company_name text, authenticated boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;