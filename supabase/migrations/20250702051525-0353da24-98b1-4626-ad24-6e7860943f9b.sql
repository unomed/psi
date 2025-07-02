
-- Política para permitir que funcionários insiram suas próprias respostas de avaliação
CREATE POLICY "Employees can insert their own assessment responses"
ON assessment_responses FOR INSERT
TO authenticated
WITH CHECK (
  employee_id = current_setting('app.current_employee_id', true)::uuid
);

-- Política para permitir que funcionários atualizem suas próprias respostas de avaliação
CREATE POLICY "Employees can update their own assessment responses"
ON assessment_responses FOR UPDATE
TO authenticated
USING (
  employee_id = current_setting('app.current_employee_id', true)::uuid
)
WITH CHECK (
  employee_id = current_setting('app.current_employee_id', true)::uuid
);

-- Política para permitir que funcionários visualizem suas próprias respostas de avaliação
CREATE POLICY "Employees can view their own assessment responses"
ON assessment_responses FOR SELECT
TO authenticated
USING (
  employee_id = current_setting('app.current_employee_id', true)::uuid
);
