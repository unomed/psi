
-- Remover as políticas problemáticas baseadas em current_setting
DROP POLICY IF EXISTS "Employees can insert their own assessment responses" ON assessment_responses;
DROP POLICY IF EXISTS "Employees can update their own assessment responses" ON assessment_responses;
DROP POLICY IF EXISTS "Employees can view their own assessment responses" ON assessment_responses;

-- Criar nova política mais permissiva para INSERT
CREATE POLICY "Authenticated users can insert assessment responses for valid employees"
ON assessment_responses FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = assessment_responses.employee_id 
    AND e.status = 'active'
  )
);

-- Criar política para SELECT que permite acesso tanto via auth quanto via employee
CREATE POLICY "Users can view assessment responses they have access to"
ON assessment_responses FOR SELECT
TO authenticated
USING (
  -- Administradores podem ver respostas das empresas que têm acesso
  (user_has_assessment_access(id) OR is_superadmin()) OR
  -- Ou se o employee_id está no localStorage (para funcionários no portal)
  (employee_id IS NOT NULL)
);

-- Criar política para UPDATE similar
CREATE POLICY "Users can update assessment responses they have access to"
ON assessment_responses FOR UPDATE
TO authenticated
USING (
  (user_has_assessment_access(id) OR is_superadmin()) OR
  (employee_id IS NOT NULL)
)
WITH CHECK (
  (user_has_assessment_access(id) OR is_superadmin()) OR
  (employee_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = assessment_responses.employee_id 
    AND e.status = 'active'
  ))
);
