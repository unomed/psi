-- Inserir configurações padrão de notificações se não existirem
INSERT INTO notification_settings (
  id,
  email_notifications,
  system_notifications,
  risk_alerts,
  deadline_alerts,
  notification_frequency,
  high_risk_threshold,
  deadline_warning_days
) VALUES (
  gen_random_uuid(),
  true,
  true,
  true,
  true,
  INTERVAL '1 day',
  80,
  7
) ON CONFLICT (id) DO NOTHING;