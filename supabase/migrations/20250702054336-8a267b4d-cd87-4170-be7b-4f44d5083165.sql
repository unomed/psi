
-- Remover políticas atuais que usam TO authenticated
DROP POLICY IF EXISTS "Authenticated users can insert assessment responses for valid employees" ON assessment_responses;
DROP POLICY IF EXISTS "Users can view assessment responses they have access to" ON assessment_responses;
DROP POLICY IF EXISTS "Users can update assessment responses they have access to" ON assessment_responses;

-- Criar política para INSERT que permite acesso público mas com validação rigorosa
CREATE POLICY "Allow insert assessment responses for valid active employees"
ON assessment_responses FOR INSERT
TO public
WITH CHECK (
  -- Deve ter um employee_id válido e ativo
  employee_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = assessment_responses.employee_id 
    AND e.status = 'active'
  )
);

-- Criar política para SELECT que permite acesso tanto para admins quanto funcionários
CREATE POLICY "Allow view assessment responses with proper access"
ON assessment_responses FOR SELECT
TO public
USING (
  -- Administradores autenticados podem ver respostas das empresas que têm acesso
  (auth.uid() IS NOT NULL AND (user_has_assessment_access(id) OR is_superadmin())) OR
  -- Ou qualquer um pode ver se há um employee_id válido (para funcionários do portal)
  (employee_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = assessment_responses.employee_id 
    AND e.status = 'active'
  ))
);

-- Criar política para UPDATE similar
CREATE POLICY "Allow update assessment responses with proper access"
ON assessment_responses FOR UPDATE
TO public
USING (
  -- Administradores autenticados podem atualizar
  (auth.uid() IS NOT NULL AND (user_has_assessment_access(id) OR is_superadmin())) OR
  -- Ou se há employee_id válido
  (employee_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = assessment_responses.employee_id 
    AND e.status = 'active'
  ))
)
WITH CHECK (
  -- Mesmas validações para o CHECK
  (auth.uid() IS NOT NULL AND (user_has_assessment_access(id) OR is_superadmin())) OR
  (employee_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = assessment_responses.employee_id 
    AND e.status = 'active'
  ))
);
