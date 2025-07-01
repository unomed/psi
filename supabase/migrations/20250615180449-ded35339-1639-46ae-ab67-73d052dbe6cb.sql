
-- Atualizar registros existentes que têm employee_tags como NULL para array vazio
UPDATE employees 
SET employee_tags = '[]'::jsonb 
WHERE employee_tags IS NULL;

-- Alterar a coluna para NOT NULL com default de array vazio
ALTER TABLE employees 
ALTER COLUMN employee_tags SET NOT NULL,
ALTER COLUMN employee_tags SET DEFAULT '[]'::jsonb;

-- Adicionar comentário para documentação
COMMENT ON COLUMN employees.employee_tags IS 'Array JSON com as tags/competências do funcionário (sempre array, nunca null)';
