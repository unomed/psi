-- FASE 2: Configurações Psicossociais - Criar apenas tabelas que não existem

-- 1. Configurações de background/automação psicossocial
CREATE TABLE IF NOT EXISTS psychosocial_background_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  auto_analysis_enabled BOOLEAN DEFAULT true,
  notification_email TEXT,
  escalation_enabled BOOLEAN DEFAULT false,
  escalation_threshold INTEGER DEFAULT 80,
  batch_processing_enabled BOOLEAN DEFAULT true,
  processing_frequency INTEGER DEFAULT 24, -- horas
  backup_retention_days INTEGER DEFAULT 90,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Pesos das categorias psicossociais
CREATE TABLE IF NOT EXISTS psychosocial_category_weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  category psychosocial_risk_category NOT NULL,
  weight NUMERIC(5,2) DEFAULT 1.0 CHECK (weight > 0 AND weight <= 10),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, category)
);

-- 5. Configurações específicas de risco psicossocial por empresa
CREATE TABLE IF NOT EXISTS psychosocial_risk_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  risk_matrix_config JSONB DEFAULT '{}', -- configuração da matriz de risco
  notification_rules JSONB DEFAULT '[]', -- regras de notificação
  action_plan_templates JSONB DEFAULT '[]', -- templates de plano de ação
  compliance_requirements JSONB DEFAULT '{}', -- requisitos de conformidade NR-01
  custom_thresholds JSONB DEFAULT '{}', -- limites customizados por categoria
  auto_generation_enabled BOOLEAN DEFAULT true,
  manager_notification_enabled BOOLEAN DEFAULT true,
  hr_notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id)
);

-- Habilitar RLS apenas se necessário
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'psychosocial_background_settings' 
    AND policyname = 'Users can manage psychosocial background settings for their companies'
  ) THEN
    ALTER TABLE psychosocial_background_settings ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage psychosocial background settings for their companies"
    ON psychosocial_background_settings FOR ALL
    USING (user_has_company_access(company_id) OR is_superadmin())
    WITH CHECK (user_has_company_access(company_id) OR is_superadmin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'psychosocial_category_weights' 
    AND policyname = 'Users can manage psychosocial category weights for their companies'
  ) THEN
    ALTER TABLE psychosocial_category_weights ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage psychosocial category weights for their companies"
    ON psychosocial_category_weights FOR ALL
    USING (user_has_company_access(company_id) OR is_superadmin())
    WITH CHECK (user_has_company_access(company_id) OR is_superadmin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'psychosocial_risk_config' 
    AND policyname = 'Users can manage psychosocial risk config for their companies'
  ) THEN
    ALTER TABLE psychosocial_risk_config ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage psychosocial risk config for their companies"
    ON psychosocial_risk_config FOR ALL
    USING (user_has_company_access(company_id) OR is_superadmin())
    WITH CHECK (user_has_company_access(company_id) OR is_superadmin());
  END IF;
END $$;

-- Inserir configurações padrão para empresas existentes
INSERT INTO psychosocial_background_settings (company_id, notification_email)
SELECT 
  c.id,
  c.contact_email
FROM companies c
WHERE NOT EXISTS (
  SELECT 1 FROM psychosocial_background_settings pbs 
  WHERE pbs.company_id = c.id
)
ON CONFLICT DO NOTHING;

-- Inserir pesos padrão para categorias psicossociais
INSERT INTO psychosocial_category_weights (company_id, category, weight)
SELECT 
  c.id,
  cat.category,
  1.0
FROM companies c
CROSS JOIN (
  VALUES 
    ('organizacao_trabalho'::psychosocial_risk_category),
    ('relacoes_sociais'::psychosocial_risk_category),
    ('fatores_psicossociais'::psychosocial_risk_category)
) cat(category)
WHERE NOT EXISTS (
  SELECT 1 FROM psychosocial_category_weights pcw 
  WHERE pcw.company_id = c.id AND pcw.category = cat.category
)
ON CONFLICT DO NOTHING;

-- Inserir configurações de risco padrão
INSERT INTO psychosocial_risk_config (company_id)
SELECT c.id
FROM companies c
WHERE NOT EXISTS (
  SELECT 1 FROM psychosocial_risk_config prc 
  WHERE prc.company_id = c.id
)
ON CONFLICT DO NOTHING;