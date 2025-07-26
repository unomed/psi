-- Primeiro, verificar se as funções necessárias existem
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
SET search_path = public
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

-- Função para configurar sessão do funcionário
CREATE OR REPLACE FUNCTION public.set_employee_session(
  employee_id_value uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Agora vamos melhorar as políticas RLS para assessment_responses
-- para permitir funcionários inserir através do portal

-- Remover a política atual de INSERT e criar uma mais específica
DROP POLICY IF EXISTS "Employees can insert their own assessment responses" ON public.assessment_responses;

-- Nova política que permite funcionários autenticados via portal inserir respostas
CREATE POLICY "Employees can insert their own assessment responses via portal"
ON public.assessment_responses
FOR INSERT
WITH CHECK (
  -- Permitir se o employee_id corresponde ao funcionário ativo da sessão
  (
    current_setting('app.current_employee_id', true) IS NOT NULL 
    AND employee_id::text = current_setting('app.current_employee_id', true)
    AND employee_id IN (
      SELECT id FROM public.employees 
      WHERE id = assessment_responses.employee_id 
      AND status = 'active'
      AND employee_type = 'funcionario'
    )
  )
  OR
  -- Permitir usuários autenticados normalmente
  (auth.uid() IS NOT NULL AND (
    user_has_assessment_access(template_id) OR 
    is_superadmin()
  ))
);