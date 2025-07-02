-- Adicionar colunas para controle de notificações
ALTER TABLE psychosocial_risk_analysis 
ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE action_plans 
ADD COLUMN IF NOT EXISTS deadline_notification_sent TIMESTAMP WITH TIME ZONE;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_psychosocial_risk_notification 
ON psychosocial_risk_analysis(notification_sent_at, created_at);

CREATE INDEX IF NOT EXISTS idx_action_plans_deadline 
ON action_plans(due_date, deadline_notification_sent) WHERE status != 'completed';