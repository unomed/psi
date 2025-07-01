
-- Fase 3: Dashboard Analytics & Relatórios Avançados
-- Criar tabelas para métricas, KPIs e relatórios avançados

-- Tabela para armazenar métricas calculadas e KPIs
CREATE TABLE IF NOT EXISTS psychosocial_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    sector_id UUID,
    role_id UUID,
    metric_type TEXT NOT NULL, -- 'risk_trend', 'compliance_rate', 'action_effectiveness', etc
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_unit TEXT DEFAULT 'percentage', -- 'percentage', 'count', 'score', 'days'
    calculation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    period_start DATE,
    period_end DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para dashboard widgets personalizáveis
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    user_id UUID,
    widget_type TEXT NOT NULL, -- 'chart', 'metric', 'table', 'alert'
    widget_name TEXT NOT NULL,
    widget_config JSONB NOT NULL DEFAULT '{}',
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 4,
    height INTEGER DEFAULT 3,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para relatórios agendados
CREATE TABLE IF NOT EXISTS scheduled_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    report_name TEXT NOT NULL,
    report_type TEXT NOT NULL, -- 'compliance', 'risk_analysis', 'trend_analysis', 'executive_summary'
    schedule_frequency TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly'
    schedule_day INTEGER, -- dia da semana (1-7) ou dia do mês (1-31)
    recipients JSONB NOT NULL DEFAULT '[]',
    report_filters JSONB DEFAULT '{}',
    last_generated_at TIMESTAMP WITH TIME ZONE,
    next_generation_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para histórico de relatórios gerados
CREATE TABLE IF NOT EXISTS report_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheduled_report_id UUID REFERENCES scheduled_reports(id) ON DELETE CASCADE,
    company_id UUID NOT NULL,
    report_name TEXT NOT NULL,
    generation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    report_data JSONB NOT NULL,
    file_url TEXT,
    status TEXT DEFAULT 'generated', -- 'generating', 'generated', 'sent', 'failed'
    recipients_sent JSONB DEFAULT '[]',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para alertas e notificações avançadas
CREATE TABLE IF NOT EXISTS advanced_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    alert_name TEXT NOT NULL,
    alert_type TEXT NOT NULL, -- 'threshold', 'trend', 'compliance', 'deadline'
    trigger_conditions JSONB NOT NULL,
    notification_channels JSONB DEFAULT '[]', -- 'email', 'sms', 'dashboard', 'webhook'
    recipients JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    trigger_count INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para benchmark e comparações setoriais
CREATE TABLE IF NOT EXISTS sector_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_sector TEXT NOT NULL,
    risk_category psychosocial_risk_category NOT NULL,
    benchmark_score NUMERIC NOT NULL,
    percentile_25 NUMERIC,
    percentile_50 NUMERIC,
    percentile_75 NUMERIC,
    percentile_90 NUMERIC,
    sample_size INTEGER,
    data_source TEXT,
    validity_period_start DATE,
    validity_period_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_psychosocial_metrics_company_date ON psychosocial_metrics(company_id, calculation_date);
CREATE INDEX IF NOT EXISTS idx_psychosocial_metrics_type ON psychosocial_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_company_user ON dashboard_widgets(company_id, user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_company ON scheduled_reports(company_id);
CREATE INDEX IF NOT EXISTS idx_report_history_company_date ON report_history(company_id, generation_date);
CREATE INDEX IF NOT EXISTS idx_advanced_alerts_company ON advanced_alerts(company_id);
CREATE INDEX IF NOT EXISTS idx_sector_benchmarks_industry ON sector_benchmarks(industry_sector, risk_category);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_dashboard_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_psychosocial_metrics_updated_at
    BEFORE UPDATE ON psychosocial_metrics
    FOR EACH ROW EXECUTE FUNCTION update_dashboard_timestamp();

CREATE TRIGGER update_dashboard_widgets_updated_at
    BEFORE UPDATE ON dashboard_widgets
    FOR EACH ROW EXECUTE FUNCTION update_dashboard_timestamp();

CREATE TRIGGER update_scheduled_reports_updated_at
    BEFORE UPDATE ON scheduled_reports
    FOR EACH ROW EXECUTE FUNCTION update_dashboard_timestamp();

CREATE TRIGGER update_advanced_alerts_updated_at
    BEFORE UPDATE ON advanced_alerts
    FOR EACH ROW EXECUTE FUNCTION update_dashboard_timestamp();

CREATE TRIGGER update_sector_benchmarks_updated_at
    BEFORE UPDATE ON sector_benchmarks
    FOR EACH ROW EXECUTE FUNCTION update_dashboard_timestamp();

-- Função para calcular métricas automáticas
CREATE OR REPLACE FUNCTION calculate_psychosocial_metrics(p_company_id UUID, p_calculation_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE(metric_name TEXT, metric_value NUMERIC, metric_unit TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_assessments INTEGER;
    high_risk_count INTEGER;
    critical_risk_count INTEGER;
    compliance_rate NUMERIC;
    avg_processing_time NUMERIC;
BEGIN
    -- Total de avaliações no período
    SELECT COUNT(*) INTO total_assessments
    FROM psychosocial_risk_analysis pra
    WHERE pra.company_id = p_company_id
    AND pra.evaluation_date <= p_calculation_date
    AND pra.evaluation_date >= p_calculation_date - INTERVAL '30 days';

    -- Contagem de riscos altos e críticos
    SELECT 
        COUNT(CASE WHEN exposure_level = 'alto' THEN 1 END),
        COUNT(CASE WHEN exposure_level = 'critico' THEN 1 END)
    INTO high_risk_count, critical_risk_count
    FROM psychosocial_risk_analysis pra
    WHERE pra.company_id = p_company_id
    AND pra.evaluation_date <= p_calculation_date
    AND pra.evaluation_date >= p_calculation_date - INTERVAL '30 days';

    -- Taxa de conformidade (% de ações implementadas)
    SELECT COALESCE(
        AVG(CASE WHEN ap.status = 'completed' THEN 100.0 ELSE 0.0 END), 0
    ) INTO compliance_rate
    FROM action_plans ap
    WHERE ap.company_id = p_company_id
    AND ap.created_at <= p_calculation_date
    AND ap.created_at >= p_calculation_date - INTERVAL '30 days';

    -- Tempo médio de processamento
    SELECT COALESCE(AVG(
        EXTRACT(EPOCH FROM (completed_at - started_at)) / 60
    ), 0) INTO avg_processing_time
    FROM psychosocial_processing_logs ppl
    WHERE ppl.company_id = p_company_id
    AND ppl.status = 'completed'
    AND ppl.created_at <= p_calculation_date
    AND ppl.created_at >= p_calculation_date - INTERVAL '30 days';

    -- Retornar métricas
    RETURN QUERY VALUES
        ('total_assessments', total_assessments::NUMERIC, 'count'),
        ('high_risk_percentage', CASE WHEN total_assessments > 0 THEN (high_risk_count::NUMERIC / total_assessments * 100) ELSE 0 END, 'percentage'),
        ('critical_risk_percentage', CASE WHEN total_assessments > 0 THEN (critical_risk_count::NUMERIC / total_assessments * 100) ELSE 0 END, 'percentage'),
        ('compliance_rate', compliance_rate, 'percentage'),
        ('avg_processing_time', avg_processing_time, 'minutes');
END;
$$;

-- Função para gerar dados de dashboard
CREATE OR REPLACE FUNCTION get_dashboard_analytics(p_company_id UUID, p_period_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB := '{}';
    risk_trend JSONB;
    sector_breakdown JSONB;
    action_effectiveness JSONB;
BEGIN
    -- Tendência de riscos nos últimos períodos
    SELECT jsonb_agg(
        jsonb_build_object(
            'date', evaluation_date,
            'high_risk', COUNT(CASE WHEN exposure_level = 'alto' THEN 1 END),
            'critical_risk', COUNT(CASE WHEN exposure_level = 'critico' THEN 1 END),
            'total', COUNT(*)
        ) ORDER BY evaluation_date
    ) INTO risk_trend
    FROM psychosocial_risk_analysis
    WHERE company_id = p_company_id
    AND evaluation_date >= CURRENT_DATE - (p_period_days || ' days')::INTERVAL
    GROUP BY evaluation_date;

    -- Breakdown por setor
    SELECT jsonb_agg(
        jsonb_build_object(
            'sector_name', s.name,
            'high_risk_count', COUNT(CASE WHEN pra.exposure_level = 'alto' THEN 1 END),
            'critical_risk_count', COUNT(CASE WHEN pra.exposure_level = 'critico' THEN 1 END),
            'total_analyses', COUNT(*)
        )
    ) INTO sector_breakdown
    FROM psychosocial_risk_analysis pra
    LEFT JOIN sectors s ON pra.sector_id = s.id
    WHERE pra.company_id = p_company_id
    AND pra.evaluation_date >= CURRENT_DATE - (p_period_days || ' days')::INTERVAL
    GROUP BY s.id, s.name;

    -- Efetividade dos planos de ação
    SELECT jsonb_agg(
        jsonb_build_object(
            'risk_level', risk_level,
            'total_plans', COUNT(*),
            'completed_plans', COUNT(CASE WHEN status = 'completed' THEN 1 END),
            'completion_rate', ROUND(
                COUNT(CASE WHEN status = 'completed' THEN 1 END)::NUMERIC / 
                COUNT(*)::NUMERIC * 100, 2
            )
        )
    ) INTO action_effectiveness
    FROM action_plans
    WHERE company_id = p_company_id
    AND created_at >= CURRENT_DATE - (p_period_days || ' days')::INTERVAL
    GROUP BY risk_level;

    -- Compilar resultado
    result := jsonb_build_object(
        'risk_trend', COALESCE(risk_trend, '[]'::jsonb),
        'sector_breakdown', COALESCE(sector_breakdown, '[]'::jsonb),
        'action_effectiveness', COALESCE(action_effectiveness, '[]'::jsonb),
        'generated_at', now()
    );

    RETURN result;
END;
$$;

-- Inserir dados de exemplo para benchmarks setoriais
INSERT INTO sector_benchmarks (industry_sector, risk_category, benchmark_score, percentile_25, percentile_50, percentile_75, percentile_90, sample_size, data_source, validity_period_start, validity_period_end) VALUES
('Manufatura', 'organizacao_trabalho', 65.5, 45.2, 62.1, 78.3, 89.1, 1250, 'MTE Research 2024', '2024-01-01', '2024-12-31'),
('Manufatura', 'condicoes_ambientais', 58.3, 38.7, 55.9, 72.4, 85.6, 1250, 'MTE Research 2024', '2024-01-01', '2024-12-31'),
('Serviços', 'organizacao_trabalho', 52.8, 35.1, 49.2, 67.5, 82.3, 980, 'MTE Research 2024', '2024-01-01', '2024-12-31'),
('Serviços', 'relacoes_socioprofissionais', 47.2, 28.9, 44.1, 63.8, 78.5, 980, 'MTE Research 2024', '2024-01-01', '2024-12-31'),
('Tecnologia', 'organizacao_trabalho', 48.9, 32.4, 46.7, 62.1, 75.8, 650, 'MTE Research 2024', '2024-01-01', '2024-12-31'),
('Tecnologia', 'reconhecimento_crescimento', 42.1, 25.6, 39.8, 56.9, 71.2, 650, 'MTE Research 2024', '2024-01-01', '2024-12-31'),
('Saúde', 'condicoes_ambientais', 61.7, 42.3, 58.9, 75.1, 87.4, 890, 'MTE Research 2024', '2024-01-01', '2024-12-31'),
('Saúde', 'elo_trabalho_vida_social', 59.4, 39.8, 56.2, 73.6, 85.9, 890, 'MTE Research 2024', '2024-01-01', '2024-12-31');

-- Comentários nas tabelas
COMMENT ON TABLE psychosocial_metrics IS 'Métricas calculadas e KPIs para dashboard analytics';
COMMENT ON TABLE dashboard_widgets IS 'Configuração de widgets personalizáveis do dashboard';
COMMENT ON TABLE scheduled_reports IS 'Relatórios agendados para geração automática';
COMMENT ON TABLE report_history IS 'Histórico de relatórios gerados';
COMMENT ON TABLE advanced_alerts IS 'Sistema de alertas avançados baseado em condições';
COMMENT ON TABLE sector_benchmarks IS 'Dados de benchmark setorial para comparações';
