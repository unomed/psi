
-- Criar função para configurar settings de sessão para funcionários
CREATE OR REPLACE FUNCTION public.set_config(
  setting_name TEXT,
  setting_value TEXT,
  is_local BOOLEAN DEFAULT false
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Configurar o setting para a sessão atual
  PERFORM set_config(setting_name, setting_value, is_local);
END;
$$;

-- Função para obter o ID do funcionário atual da sessão
CREATE OR REPLACE FUNCTION public.get_current_employee_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  employee_id_text TEXT;
  employee_id UUID;
BEGIN
  -- Obter o setting da sessão
  employee_id_text := current_setting('app.current_employee_id', true);
  
  -- Se estiver vazio ou nulo, retornar NULL
  IF employee_id_text IS NULL OR employee_id_text = '' THEN
    RETURN NULL;
  END IF;
  
  -- Converter para UUID
  BEGIN
    employee_id := employee_id_text::UUID;
    RETURN employee_id;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN NULL;
  END;
END;
$$;

-- Remover políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Employees can manage their own mood logs" ON public.employee_mood_logs;
DROP POLICY IF EXISTS "Users can view employee mood logs for their companies" ON public.employee_mood_logs;
DROP POLICY IF EXISTS "Users can insert employee mood logs for their companies" ON public.employee_mood_logs;
DROP POLICY IF EXISTS "Users can update employee mood logs for their companies" ON public.employee_mood_logs;
DROP POLICY IF EXISTS "Users can delete employee mood logs for their companies" ON public.employee_mood_logs;

-- Criar nova política simplificada para funcionários no portal
CREATE POLICY "Employee portal access for mood logs"
  ON public.employee_mood_logs
  FOR ALL
  USING (
    employee_id::text = current_setting('app.current_employee_id', true) OR
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = employee_mood_logs.employee_id
      AND public.user_has_company_access(e.company_id)
    )
  )
  WITH CHECK (
    employee_id::text = current_setting('app.current_employee_id', true) OR
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = employee_mood_logs.employee_id
      AND public.user_has_company_access(e.company_id)
    )
  );
