-- Adicionar coluna risk_level à tabela scheduled_assessments
ALTER TABLE scheduled_assessments
ADD COLUMN IF NOT EXISTS risk_level VARCHAR(50);

-- Adicionar coluna risk_level à tabela assessment_responses
ALTER TABLE assessment_responses
ADD COLUMN IF NOT EXISTS risk_level VARCHAR(50);

-- Adicionar coluna completed_at à tabela scheduled_assessments se não existir
ALTER TABLE scheduled_assessments
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Comentário explicativo
COMMENT ON COLUMN scheduled_assessments.risk_level IS 'Nível de risco calculado após a conclusão da avaliação (Baixo, Médio, Alto)';
COMMENT ON COLUMN assessment_responses.risk_level IS 'Nível de risco calculado com base nas respostas da avaliação';
COMMENT ON COLUMN scheduled_assessments.completed_at IS 'Data e hora em que a avaliação foi concluída pelo funcionário';
