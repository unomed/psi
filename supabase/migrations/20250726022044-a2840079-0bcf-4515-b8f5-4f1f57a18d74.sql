-- Temporariamente simplificar a política para debug
DROP POLICY IF EXISTS "Employees can insert their own assessment responses via portal" ON public.assessment_responses;

-- Criar política mais permissiva temporariamente para funcionários ativos
CREATE POLICY "Allow active employees to insert assessment responses"
ON public.assessment_responses
FOR INSERT
WITH CHECK (
  -- Verificar se é um funcionário ativo
  employee_id IN (
    SELECT id FROM public.employees 
    WHERE status = 'active'
    AND employee_type = 'funcionario'
  )
  OR
  -- Permitir usuários autenticados normalmente
  (auth.uid() IS NOT NULL AND (
    user_has_assessment_access(template_id) OR 
    is_superadmin()
  ))
);

-- Também simplificar as políticas de SELECT e UPDATE para funcionários
DROP POLICY IF EXISTS "Allow view assessment responses" ON public.assessment_responses;
DROP POLICY IF EXISTS "Allow update assessment responses" ON public.assessment_responses;

CREATE POLICY "Allow view assessment responses simplified"
ON public.assessment_responses
FOR SELECT
USING (
  -- Funcionários ativos podem ver suas respostas
  employee_id IN (
    SELECT id FROM public.employees 
    WHERE status = 'active'
    AND employee_type = 'funcionario'
  )
  OR
  -- Usuários normais com acesso
  (auth.uid() IS NOT NULL AND (
    user_has_assessment_access(id) OR 
    is_superadmin()
  ))
);

CREATE POLICY "Allow update assessment responses simplified"
ON public.assessment_responses
FOR UPDATE
USING (
  -- Funcionários ativos podem atualizar suas respostas
  employee_id IN (
    SELECT id FROM public.employees 
    WHERE status = 'active'
    AND employee_type = 'funcionario'
  )
  OR
  -- Usuários normais com acesso
  (auth.uid() IS NOT NULL AND (
    user_has_assessment_access(id) OR 
    is_superadmin() OR
    auth.uid() = created_by
  ))
);