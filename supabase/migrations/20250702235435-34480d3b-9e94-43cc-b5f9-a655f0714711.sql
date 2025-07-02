-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Configurar job cron para executar notificações diariamente às 9h
SELECT cron.schedule(
  'send-daily-notifications',
  '0 9 * * *', -- Todo dia às 9h
  $$
  SELECT
    net.http_post(
        url:='https://ngpenivrpznqycgkibrs.supabase.co/functions/v1/send-notifications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncGVuaXZycHpucXljZ2tpYnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNzc3MzAsImV4cCI6MjA1OTY1MzczMH0.JKYV2dCMsszTqThVW1Vd9mQX8OlJV-dAgQfuxSD5HxY"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);