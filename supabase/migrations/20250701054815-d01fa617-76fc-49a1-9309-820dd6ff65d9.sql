
-- Habilitar RLS e criar políticas para payment_logs
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmins can view all payment logs"
  ON public.payment_logs
  FOR SELECT
  USING (public.is_superadmin());

CREATE POLICY "Users can view payment logs for their companies"
  ON public.payment_logs
  FOR SELECT
  USING (public.user_has_company_access(company_id));

CREATE POLICY "Superadmins can insert payment logs"
  ON public.payment_logs
  FOR INSERT
  WITH CHECK (public.is_superadmin());

CREATE POLICY "Superadmins can update payment logs"
  ON public.payment_logs
  FOR UPDATE
  USING (public.is_superadmin());

-- Habilitar RLS e criar políticas para billing_events
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmins can view all billing events"
  ON public.billing_events
  FOR SELECT
  USING (public.is_superadmin());

CREATE POLICY "Users can view billing events for their companies"
  ON public.billing_events
  FOR SELECT
  USING (public.user_has_company_access(company_id));

CREATE POLICY "Only superadmins can insert billing events"
  ON public.billing_events
  FOR INSERT
  WITH CHECK (public.is_superadmin());

CREATE POLICY "Only superadmins can update billing events"
  ON public.billing_events
  FOR UPDATE
  USING (public.is_superadmin());

-- Habilitar RLS e criar políticas para scheduled_reports
ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view scheduled reports for their companies"
  ON public.scheduled_reports
  FOR SELECT
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

CREATE POLICY "Users can insert scheduled reports for their companies"
  ON public.scheduled_reports
  FOR INSERT
  WITH CHECK (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

CREATE POLICY "Users can update scheduled reports for their companies"
  ON public.scheduled_reports
  FOR UPDATE
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

CREATE POLICY "Users can delete scheduled reports for their companies"
  ON public.scheduled_reports
  FOR DELETE
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

-- Habilitar RLS e criar políticas para report_history
ALTER TABLE public.report_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view report history for their companies"
  ON public.report_history
  FOR SELECT
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

CREATE POLICY "Users can insert report history for their companies"
  ON public.report_history
  FOR INSERT
  WITH CHECK (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

CREATE POLICY "Users can update report history for their companies"
  ON public.report_history
  FOR UPDATE
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

-- Habilitar RLS e criar políticas para psychosocial_metrics
ALTER TABLE public.psychosocial_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view psychosocial metrics for their companies"
  ON public.psychosocial_metrics
  FOR SELECT
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

CREATE POLICY "Users can insert psychosocial metrics for their companies"
  ON public.psychosocial_metrics
  FOR INSERT
  WITH CHECK (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

CREATE POLICY "Users can update psychosocial metrics for their companies"
  ON public.psychosocial_metrics
  FOR UPDATE
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

-- Habilitar RLS e criar políticas para dashboard_widgets
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view dashboard widgets for their companies"
  ON public.dashboard_widgets
  FOR SELECT
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id) OR
    (user_id IS NOT NULL AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert dashboard widgets for their companies"
  ON public.dashboard_widgets
  FOR INSERT
  WITH CHECK (
    public.is_superadmin() OR
    public.user_has_company_access(company_id) OR
    (user_id IS NOT NULL AND user_id = auth.uid())
  );

CREATE POLICY "Users can update dashboard widgets for their companies"
  ON public.dashboard_widgets
  FOR UPDATE
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id) OR
    (user_id IS NOT NULL AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete dashboard widgets for their companies"
  ON public.dashboard_widgets
  FOR DELETE
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id) OR
    (user_id IS NOT NULL AND user_id = auth.uid())
  );

-- Habilitar RLS e criar políticas para advanced_alerts
ALTER TABLE public.advanced_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view advanced alerts for their companies"
  ON public.advanced_alerts
  FOR SELECT
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

CREATE POLICY "Users can insert advanced alerts for their companies"
  ON public.advanced_alerts
  FOR INSERT
  WITH CHECK (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

CREATE POLICY "Users can update advanced alerts for their companies"
  ON public.advanced_alerts
  FOR UPDATE
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

CREATE POLICY "Users can delete advanced alerts for their companies"
  ON public.advanced_alerts
  FOR DELETE
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(company_id)
  );

-- Comentários para documentação
COMMENT ON POLICY "Superadmins can view all payment logs" ON public.payment_logs 
IS 'Permite que superadmins vejam todos os logs de pagamento do sistema';

COMMENT ON POLICY "Users can view payment logs for their companies" ON public.payment_logs 
IS 'Permite que usuários vejam logs de pagamento apenas de suas empresas';

COMMENT ON POLICY "Users can view scheduled reports for their companies" ON public.scheduled_reports 
IS 'Permite que usuários vejam relatórios agendados apenas de suas empresas';

COMMENT ON POLICY "Users can view psychosocial metrics for their companies" ON public.psychosocial_metrics 
IS 'Permite que usuários vejam métricas psicossociais apenas de suas empresas';

COMMENT ON POLICY "Users can view dashboard widgets for their companies" ON public.dashboard_widgets 
IS 'Permite que usuários vejam widgets do dashboard de suas empresas ou pessoais';

COMMENT ON POLICY "Users can view advanced alerts for their companies" ON public.advanced_alerts 
IS 'Permite que usuários vejam alertas avançados apenas de suas empresas';
