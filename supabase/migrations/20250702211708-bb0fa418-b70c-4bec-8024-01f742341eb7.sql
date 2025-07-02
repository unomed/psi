-- FASE 2: Configurações Psicossociais - Criar tabelas para sistema de análise de risco (corrigido)

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

-- 3. Métricas psicossociais calculadas
CREATE TABLE IF NOT EXISTS psychosocial_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  sector_id UUID REFERENCES sectors(id) ON DELETE SET NULL,
  metric_type TEXT NOT NULL, -- 'risk_distribution', 'trend_analysis', 'compliance_rate'
  metric_data JSONB NOT NULL DEFAULT '{}',
  calculation_date DATE DEFAULT CURRENT_DATE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Jobs de processamento psicossocial (melhorado)
CREATE TABLE IF NOT EXISTS psychosocial_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  assessment_response_id UUID REFERENCES assessment_responses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  job_type TEXT DEFAULT 'risk_analysis' CHECK (job_type IN ('risk_analysis', 'metric_calculation', 'report_generation')),
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_psychosocial_background_settings_company 
ON psychosocial_background_settings(company_id);

CREATE INDEX IF NOT EXISTS idx_psychosocial_category_weights_company_active 
ON psychosocial_category_weights(company_id, is_active);

CREATE INDEX IF NOT EXISTS idx_psychosocial_metrics_company_date 
ON psychosocial_metrics(company_id, calculation_date);

CREATE INDEX IF NOT EXISTS idx_psychosocial_processing_jobs_status_priority 
ON psychosocial_processing_jobs(status, priority, created_at);

CREATE INDEX IF NOT EXISTS idx_psychosocial_risk_config_company 
ON psychosocial_risk_config(company_id);

-- RLS Policies
ALTER TABLE psychosocial_background_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychosocial_category_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychosocial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychosocial_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychosocial_risk_config ENABLE ROW LEVEL SECURITY;

-- Políticas para psychosocial_background_settings
CREATE POLICY "Users can manage psychosocial background settings for their companies"
ON psychosocial_background_settings FOR ALL
USING (user_has_company_access(company_id) OR is_superadmin())
WITH CHECK (user_has_company_access(company_id) OR is_superadmin());

-- Políticas para psychosocial_category_weights
CREATE POLICY "Users can manage psychosocial category weights for their companies"
ON psychosocial_category_weights FOR ALL
USING (user_has_company_access(company_id) OR is_superadmin())
WITH CHECK (user_has_company_access(company_id) OR is_superadmin());

-- Políticas para psychosocial_metrics
CREATE POLICY "Users can view psychosocial metrics for their companies"
ON psychosocial_metrics FOR SELECT
USING (user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "System can insert psychosocial metrics"
ON psychosocial_metrics FOR INSERT
WITH CHECK (true);

-- Políticas para psychosocial_processing_jobs
CREATE POLICY "Users can view processing jobs for their companies"
ON psychosocial_processing_jobs FOR SELECT
USING (user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "System can manage processing jobs"
ON psychosocial_processing_jobs FOR ALL
USING (true)
WITH CHECK (true);

-- Políticas para psychosocial_risk_config
CREATE POLICY "Users can manage psychosocial risk config for their companies"
ON psychosocial_risk_config FOR ALL
USING (user_has_company_access(company_id) OR is_superadmin())
WITH CHECK (user_has_company_access(company_id) OR is_superadmin());

-- Inserir configurações padrão para empresas existentes
INSERT INTO psychosocial_background_settings (company_id, notification_email)
SELECT 
  c.id,
  c.contact_email
FROM companies c
WHERE NOT EXISTS (
  SELECT 1 FROM psychosocial_background_settings pbs 
  WHERE pbs.company_id = c.id
);

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
);

-- Inserir configurações de risco padrão
INSERT INTO psychosocial_risk_config (company_id)
SELECT c.id
FROM companies c
WHERE NOT EXISTS (
  SELECT 1 FROM psychosocial_risk_config prc 
  WHERE prc.company_id = c.id
);