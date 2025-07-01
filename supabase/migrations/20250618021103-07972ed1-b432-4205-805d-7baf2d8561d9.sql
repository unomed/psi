
-- Verificar se a coluna scheduled_date existe e adicionar due_date se necessário
ALTER TABLE scheduled_assessments 
ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE;

-- Se a coluna scheduled_date existe, copiar os valores para due_date
UPDATE scheduled_assessments 
SET due_date = scheduled_date 
WHERE due_date IS NULL AND scheduled_date IS NOT NULL;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_scheduled_assessments_due_date ON scheduled_assessments(due_date);
