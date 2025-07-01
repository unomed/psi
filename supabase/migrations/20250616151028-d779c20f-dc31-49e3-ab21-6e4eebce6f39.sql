
-- Corrigir a foreign key constraint da tabela assessment_responses
-- Usar sintaxe correta para remover constraints

-- Remover constraint existente se ela existir
ALTER TABLE assessment_responses DROP CONSTRAINT IF EXISTS assessment_responses_employee_id_fkey;

-- Remover qualquer outra constraint FK na coluna employee_id
DO $$
DECLARE
    constraint_rec RECORD;
BEGIN
    FOR constraint_rec IN 
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'assessment_responses'
        AND kcu.column_name = 'employee_id'
        AND tc.constraint_type = 'FOREIGN KEY'
    LOOP
        EXECUTE 'ALTER TABLE assessment_responses DROP CONSTRAINT IF EXISTS ' || constraint_rec.constraint_name;
    END LOOP;
END $$;

-- Limpar dados inconsistentes
DELETE FROM assessment_responses 
WHERE employee_id IS NULL 
OR employee_id NOT IN (SELECT id FROM employees);

-- Criar a constraint correta referenciando employees
ALTER TABLE assessment_responses 
ADD CONSTRAINT fk_assessment_responses_employee_id 
FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;

-- Tornar employee_id obrigatório
ALTER TABLE assessment_responses 
ALTER COLUMN employee_id SET NOT NULL;
