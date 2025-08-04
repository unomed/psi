-- Adicionar coluna ai_config à tabela psychosocial_automation_config
ALTER TABLE psychosocial_automation_config 
ADD COLUMN IF NOT EXISTS ai_config JSONB DEFAULT '{}'::jsonb;

-- Adicionar coluna ai_enabled se não existir
ALTER TABLE psychosocial_automation_config 
ADD COLUMN IF NOT EXISTS ai_enabled BOOLEAN DEFAULT false;

-- Comentar sobre as colunas
COMMENT ON COLUMN psychosocial_automation_config.ai_config IS 'Configurações específicas de IA: openai_enabled, predictive_analysis, intelligent_recommendations, risk_trend_analysis';
COMMENT ON COLUMN psychosocial_automation_config.ai_enabled IS 'Se a funcionalidade de IA está habilitada para a empresa';