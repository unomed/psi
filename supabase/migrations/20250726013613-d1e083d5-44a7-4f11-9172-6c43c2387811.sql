-- Sincronizar due_date com scheduled_date onde necessário
UPDATE scheduled_assessments 
SET due_date = scheduled_date 
WHERE due_date IS NULL OR due_date != scheduled_date;