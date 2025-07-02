-- FASE 5: Sistema de notificações automáticas por email

-- Criar tabela para notificações de empresas
CREATE TABLE IF NOT EXISTS public.company_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para log de emails enviados
CREATE TABLE IF NOT EXISTS public.notification_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent',
  assessment_response_id UUID,
  risk_analysis_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Função para enviar notificações automáticas
CREATE OR REPLACE FUNCTION public.send_company_notification(
  p_company_id UUID,
  p_trigger_event TEXT,
  p_assessment_response_id UUID DEFAULT NULL,
  p_risk_analysis_id UUID DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_company RECORD;
  v_notification RECORD;
  v_subject TEXT;
  v_body TEXT;
  v_employee_name TEXT;
  v_risk_level TEXT;
  v_sent_count INTEGER := 0;
BEGIN
  -- Buscar dados da empresa
  SELECT * INTO v_company
  FROM companies 
  WHERE id = p_company_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Company not found');
  END IF;

  -- Buscar dados do funcionário se assessment fornecido
  IF p_assessment_response_id IS NOT NULL THEN
    SELECT e.name INTO v_employee_name
    FROM assessment_responses ar
    JOIN employees e ON ar.employee_id = e.id
    WHERE ar.id = p_assessment_response_id;
  END IF;

  -- Buscar nível de risco se análise fornecida
  IF p_risk_analysis_id IS NOT NULL THEN
    SELECT exposure_level::TEXT INTO v_risk_level
    FROM psychosocial_risk_analysis
    WHERE id = p_risk_analysis_id;
  END IF;

  -- Buscar notificações ativas para este evento
  FOR v_notification IN 
    SELECT * FROM company_notifications 
    WHERE company_id = p_company_id 
    AND trigger_event = p_trigger_event
    AND is_active = true
  LOOP
    -- Preparar subject substituindo variáveis
    v_subject := v_notification.subject_template;
    v_subject := REPLACE(v_subject, '{company_name}', v_company.name);
    v_subject := REPLACE(v_subject, '{employee_name}', COALESCE(v_employee_name, ''));
    v_subject := REPLACE(v_subject, '{risk_level}', COALESCE(v_risk_level, ''));

    -- Preparar body substituindo variáveis
    v_body := v_notification.body_template;
    v_body := REPLACE(v_body, '{company_name}', v_company.name);
    v_body := REPLACE(v_body, '{employee_name}', COALESCE(v_employee_name, ''));
    v_body := REPLACE(v_body, '{risk_level}', COALESCE(v_risk_level, ''));
    v_body := REPLACE(v_body, '{contact_name}', COALESCE(v_company.contact_name, ''));

    -- Inserir no log de emails
    INSERT INTO notification_emails (
      company_id,
      notification_type,
      recipient_email,
      subject,
      body,
      assessment_response_id,
      risk_analysis_id
    ) VALUES (
      p_company_id,
      v_notification.notification_type,
      v_notification.recipient_email,
      v_subject,
      v_body,
      p_assessment_response_id,
      p_risk_analysis_id
    );

    -- Atualizar último envio
    UPDATE company_notifications 
    SET last_sent_at = now()
    WHERE id = v_notification.id;

    v_sent_count := v_sent_count + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true, 
    'sent_count', v_sent_count,
    'company_name', v_company.name
  );
END;
$$;

-- Função melhorada para processar assessment com notificações
CREATE OR REPLACE FUNCTION public.process_psychosocial_assessment_with_notifications(
  p_assessment_response_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
  v_company_id UUID;
  v_risk_level TEXT;
  v_notification_result JSONB;
BEGIN
  -- Processar assessment original
  SELECT process_psychosocial_assessment_auto(p_assessment_response_id) INTO v_result;
  
  -- Se processamento foi bem-sucedido
  IF (v_result->>'success')::BOOLEAN = true THEN
    -- Buscar company_id
    SELECT e.company_id INTO v_company_id
    FROM assessment_responses ar
    JOIN employees e ON ar.employee_id = e.id
    WHERE ar.id = p_assessment_response_id;
    
    -- Buscar nível de risco
    SELECT exposure_level::TEXT INTO v_risk_level
    FROM psychosocial_risk_analysis
    WHERE assessment_response_id = p_assessment_response_id
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Enviar notificação geral
    SELECT send_company_notification(
      v_company_id, 
      'assessment_completed', 
      p_assessment_response_id
    ) INTO v_notification_result;
    
    -- Enviar notificação específica para risco alto/crítico
    IF v_risk_level IN ('alto', 'critico') THEN
      SELECT send_company_notification(
        v_company_id, 
        'high_risk_detected', 
        p_assessment_response_id
      ) INTO v_notification_result;
    END IF;
    
    -- Adicionar info de notificação ao resultado
    v_result := v_result || jsonb_build_object('notifications_sent', v_notification_result);
  END IF;
  
  RETURN v_result;
END;
$$;

-- Inserir notificações padrão para empresas existentes
INSERT INTO company_notifications (
  company_id,
  notification_type,
  trigger_event,
  recipient_email,
  subject_template,
  body_template
)
SELECT 
  c.id,
  'assessment_completed',
  'assessment_completed',
  COALESCE(c.contact_email, c.email),
  'Nova Avaliação Psicossocial Concluída - {company_name}',
  'Olá {contact_name},

Uma nova avaliação psicossocial foi concluída em sua empresa.

Funcionário: {employee_name}
Nível de Risco: {risk_level}
Data: ' || to_char(now(), 'DD/MM/YYYY HH24:MI') || '

Acesse o sistema para visualizar os detalhes e planos de ação.

Atenciosamente,
Sistema de Gestão de Riscos Psicossociais'
FROM companies c
WHERE COALESCE(c.contact_email, c.email) IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO company_notifications (
  company_id,
  notification_type,
  trigger_event,
  recipient_email,
  subject_template,
  body_template
)
SELECT 
  c.id,
  'high_risk_alert',
  'high_risk_detected',
  COALESCE(c.contact_email, c.email),
  'ALERTA: Risco Psicossocial ALTO/CRÍTICO Detectado - {company_name}',
  'ATENÇÃO {contact_name},

Foi detectado um risco psicossocial de nível {risk_level} em sua empresa.

Funcionário: {employee_name}
Nível de Risco: {risk_level}
Data: ' || to_char(now(), 'DD/MM/YYYY HH24:MI') || '

AÇÃO NECESSÁRIA: Conforme NR-01, é necessário implementar medidas de controle imediatas.

Acesse o sistema urgentemente para visualizar os planos de ação obrigatórios.

Atenciosamente,
Sistema de Gestão de Riscos Psicossociais'
FROM companies c
WHERE COALESCE(c.contact_email, c.email) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Atualizar trigger para usar nova função com notificações
DROP TRIGGER IF EXISTS trigger_frprt_auto_processing ON assessment_responses;

CREATE OR REPLACE FUNCTION public.trigger_frprt_processing_with_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Processar automaticamente quando uma avaliação é completada
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    -- Processar classificação FRPRT com notificações
    PERFORM process_psychosocial_assessment_with_notifications(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_frprt_auto_processing_with_notifications
  AFTER UPDATE ON assessment_responses
  FOR EACH ROW
  EXECUTE FUNCTION trigger_frprt_processing_with_notifications();

-- Função para popular jobs assíncronos baseados em avaliações pendentes
CREATE OR REPLACE FUNCTION public.populate_processing_jobs() RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_job_count INTEGER := 0;
  v_assessment RECORD;
BEGIN
  -- Buscar avaliações completadas sem job de processamento
  FOR v_assessment IN
    SELECT ar.id, ar.raw_score, e.company_id
    FROM assessment_responses ar
    JOIN employees e ON ar.employee_id = e.id
    WHERE ar.completed_at IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM psychosocial_processing_jobs ppj 
      WHERE ppj.assessment_response_id = ar.id
    )
    ORDER BY ar.completed_at DESC
    LIMIT 50
  LOOP
    -- Inserir job de processamento
    INSERT INTO psychosocial_processing_jobs (
      assessment_response_id,
      company_id,
      status,
      priority,
      retry_count,
      max_retries
    ) VALUES (
      v_assessment.id,
      v_assessment.company_id,
      'pending',
      CASE 
        WHEN COALESCE(v_assessment.raw_score, 0) >= 80 THEN 'critical'
        WHEN COALESCE(v_assessment.raw_score, 0) >= 60 THEN 'high'
        WHEN COALESCE(v_assessment.raw_score, 0) >= 40 THEN 'medium'
        ELSE 'low'
      END,
      0,
      3
    );
    
    v_job_count := v_job_count + 1;
  END LOOP;
  
  RETURN v_job_count;
END;
$$;

-- Popular jobs iniciais
SELECT populate_processing_jobs();