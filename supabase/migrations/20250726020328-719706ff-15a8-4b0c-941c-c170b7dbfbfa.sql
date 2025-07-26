-- Remover políticas RLS existentes que podem estar conflitando
DROP POLICY IF EXISTS "Allow insert assessment responses for valid active employees" ON public.assessment_responses;
DROP POLICY IF EXISTS "Users can insert assessment responses for their companies" ON public.assessment_responses;

-- Criar política específica para permitir funcionários inserir suas próprias respostas
CREATE POLICY "Employees can insert their own assessment responses"
ON public.assessment_responses
FOR INSERT
WITH CHECK (
  -- Permitir se o employee_id corresponde ao funcionário autenticado
  employee_id IN (
    SELECT id FROM public.employees 
    WHERE id = assessment_responses.employee_id 
    AND status = 'active'
  )
  OR
  -- Permitir se é um usuário autenticado com acesso à empresa
  (auth.uid() IS NOT NULL AND (
    user_has_assessment_access(template_id) OR 
    is_superadmin()
  ))
);

-- Simplificar política de UPDATE para funcionários
DROP POLICY IF EXISTS "Allow update assessment responses with proper access" ON public.assessment_responses;
DROP POLICY IF EXISTS "Enable update for authenticated users who created the response" ON public.assessment_responses;
DROP POLICY IF EXISTS "Users can update assessment responses for their companies" ON public.assessment_responses;

CREATE POLICY "Allow update assessment responses"
ON public.assessment_responses
FOR UPDATE
USING (
  -- Funcionário pode atualizar suas próprias respostas
  employee_id IN (
    SELECT id FROM public.employees 
    WHERE id = assessment_responses.employee_id 
    AND status = 'active'
  )
  OR
  -- Usuários com acesso adequado podem atualizar
  (auth.uid() IS NOT NULL AND (
    user_has_assessment_access(id) OR 
    is_superadmin() OR
    auth.uid() = created_by
  ))
);

-- Simplificar política de SELECT
DROP POLICY IF EXISTS "Allow view assessment responses with proper access" ON public.assessment_responses;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.assessment_responses;
DROP POLICY IF EXISTS "Users can view assessment responses for their companies" ON public.assessment_responses;

CREATE POLICY "Allow view assessment responses"
ON public.assessment_responses
FOR SELECT
USING (
  -- Funcionário pode ver suas próprias respostas
  employee_id IN (
    SELECT id FROM public.employees 
    WHERE id = assessment_responses.employee_id 
    AND status = 'active'
  )
  OR
  -- Usuários com acesso adequado podem ver
  (auth.uid() IS NOT NULL AND (
    user_has_assessment_access(id) OR 
    is_superadmin()
  ))
);