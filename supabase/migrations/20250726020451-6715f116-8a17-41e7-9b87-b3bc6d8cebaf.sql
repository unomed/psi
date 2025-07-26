-- Corrigir função authenticate_employee com search_path
CREATE OR REPLACE FUNCTION public.authenticate_employee(
  p_cpf text,
  p_password text
) RETURNS TABLE(
  employee_id uuid,
  employee_name text,
  company_id uuid,
  company_name text,
  is_valid boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    e.company_id,
    c.name,
    true
  FROM employees e
  JOIN companies c ON e.company_id = c.id
  WHERE e.cpf = p_cpf 
    AND e.status = 'active'
    AND e.employee_type = 'funcionario';
END;
$$;

-- Corrigir função set_employee_session com search_path
CREATE OR REPLACE FUNCTION public.set_employee_session(
  employee_id_value uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Configurar variável de sessão para identificar o funcionário atual
  PERFORM set_config('app.current_employee_id', employee_id_value::text, false);
  
  -- Também configurar o CPF para compatibilidade com políticas existentes
  PERFORM set_config('app.current_employee_cpf', 
    (SELECT cpf FROM employees WHERE id = employee_id_value), 
    false
  );
END;
$$;