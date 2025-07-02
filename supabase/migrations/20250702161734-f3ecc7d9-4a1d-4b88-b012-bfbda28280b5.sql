-- Adicionar tabela para configurações de processamento em background
CREATE TABLE IF NOT EXISTS psychosocial_background_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid,
  is_processing_enabled boolean DEFAULT false,
  max_concurrent_jobs integer DEFAULT 3,
  processing_interval_seconds integer DEFAULT 5,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE psychosocial_background_settings ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Users can view background settings for their companies"
ON psychosocial_background_settings FOR SELECT
USING (company_id IS NULL OR user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "Users can insert background settings for their companies"
ON psychosocial_background_settings FOR INSERT
WITH CHECK (company_id IS NULL OR user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "Users can update background settings for their companies"
ON psychosocial_background_settings FOR UPDATE
USING (company_id IS NULL OR user_has_company_access(company_id) OR is_superadmin());

-- Trigger para atualizar updated_at
CREATE TRIGGER update_psychosocial_background_settings_updated_at
BEFORE UPDATE ON psychosocial_background_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Inserir configuração global padrão
INSERT INTO psychosocial_background_settings (company_id, is_processing_enabled, max_concurrent_jobs, processing_interval_seconds)
VALUES (NULL, false, 3, 5)
ON CONFLICT DO NOTHING;