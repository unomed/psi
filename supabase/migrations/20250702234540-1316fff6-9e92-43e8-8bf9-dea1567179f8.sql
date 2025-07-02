-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_assessment_criteria_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS update_assessment_criteria_updated_at_trigger ON assessment_criteria_settings;

-- Criar novo trigger
CREATE TRIGGER update_assessment_criteria_updated_at_trigger
  BEFORE UPDATE ON assessment_criteria_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_assessment_criteria_updated_at();