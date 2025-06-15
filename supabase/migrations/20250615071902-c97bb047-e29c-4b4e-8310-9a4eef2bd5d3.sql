
-- Criar políticas RLS para employee_mood_logs
-- Primeiro, remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view employee mood logs" ON public.employee_mood_logs;
DROP POLICY IF EXISTS "Users can insert employee mood logs" ON public.employee_mood_logs;
DROP POLICY IF EXISTS "Users can update employee mood logs" ON public.employee_mood_logs;
DROP POLICY IF EXISTS "Users can delete employee mood logs" ON public.employee_mood_logs;

-- Habilitar RLS na tabela (caso não esteja habilitado)
ALTER TABLE public.employee_mood_logs ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: Permitir que usuários vejam logs de humor de funcionários de suas empresas
CREATE POLICY "Users can view employee mood logs for their companies"
  ON public.employee_mood_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = employee_mood_logs.employee_id
      AND public.user_has_company_access(e.company_id)
    )
  );

-- Política para INSERT: Permitir que usuários insiram logs de humor para funcionários de suas empresas
CREATE POLICY "Users can insert employee mood logs for their companies"
  ON public.employee_mood_logs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = employee_mood_logs.employee_id
      AND public.user_has_company_access(e.company_id)
    )
  );

-- Política para UPDATE: Permitir que usuários atualizem logs de humor para funcionários de suas empresas
CREATE POLICY "Users can update employee mood logs for their companies"
  ON public.employee_mood_logs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = employee_mood_logs.employee_id
      AND public.user_has_company_access(e.company_id)
    )
  );

-- Política para DELETE: Permitir que usuários deletem logs de humor para funcionários de suas empresas
CREATE POLICY "Users can delete employee mood logs for their companies"
  ON public.employee_mood_logs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = employee_mood_logs.employee_id
      AND public.user_has_company_access(e.company_id)
    )
  );

-- Política especial para o portal do funcionário: permitir que funcionários gerenciem seus próprios logs
-- Isso funcionará quando houver uma sessão de funcionário ativa
CREATE POLICY "Employees can manage their own mood logs"
  ON public.employee_mood_logs
  FOR ALL
  USING (
    employee_id::text = current_setting('app.current_employee_id', true)
  )
  WITH CHECK (
    employee_id::text = current_setting('app.current_employee_id', true)
  );
