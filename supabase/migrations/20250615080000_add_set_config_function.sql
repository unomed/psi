
-- Função para configurar settings de sessão para funcionários
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
