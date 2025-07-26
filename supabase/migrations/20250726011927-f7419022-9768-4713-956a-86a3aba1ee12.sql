-- Atualizar registros existentes onde due_date é null
UPDATE scheduled_assessments 
SET due_date = scheduled_date 
WHERE due_date IS NULL AND scheduled_date IS NOT NULL;