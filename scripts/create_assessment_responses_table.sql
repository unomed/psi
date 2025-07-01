-- Tabela para armazenar as respostas das avaliações
CREATE TABLE IF NOT EXISTS assessment_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assessment_id UUID REFERENCES scheduled_assessments(id),
  employee_id UUID REFERENCES employees(id),
  template_id UUID REFERENCES checklist_templates(id),
  responses JSONB,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_assessment_responses_assessment_id ON assessment_responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_employee_id ON assessment_responses(employee_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_template_id ON assessment_responses(template_id);

-- Permissões RLS (Row Level Security)
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- Política para permitir que administradores vejam todas as respostas
CREATE POLICY admin_all_access ON assessment_responses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'manager')
    )
  );

-- Política para permitir que funcionários vejam apenas suas próprias respostas
CREATE POLICY employee_own_access ON assessment_responses
  FOR SELECT
  TO authenticated
  USING (
    employee_id = (
      SELECT employee_id FROM employee_auth
      WHERE user_id = auth.uid()
    )
  );

-- Comentários na tabela
COMMENT ON TABLE assessment_responses IS 'Armazena as respostas dos funcionários para avaliações agendadas';
COMMENT ON COLUMN assessment_responses.responses IS 'Respostas do questionário em formato JSON com IDs das perguntas como chaves';
COMMENT ON COLUMN assessment_responses.completed_at IS 'Data e hora em que o funcionário completou a avaliação';
