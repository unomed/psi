-- FASE 3: Sistema de Relatórios com Classificação FRPRT Correta
-- Criação das tabelas para relatórios automáticos conforme NR-01

-- 1. Tabela para histórico de relatórios gerados
CREATE TABLE public.report_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  report_type TEXT NOT NULL, -- 'nr01_compliance', 'sector_analysis', 'frprt_analysis'
  report_title TEXT NOT NULL,
  generated_by UUID,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_assessments INTEGER NOT NULL DEFAULT 0,
  frprt_findings JSONB NOT NULL DEFAULT '{}', -- Classificações FRPRT encontradas
  report_data JSONB NOT NULL DEFAULT '{}', -- Dados completos do relatório
  file_path TEXT, -- Caminho do arquivo PDF gerado
  status TEXT NOT NULL DEFAULT 'completed' -- 'generating', 'completed', 'error'
);

-- 2. Tabela para relatórios automáticos agendados
CREATE TABLE public.scheduled_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  report_type TEXT NOT NULL,
  report_name TEXT NOT NULL,
  frequency TEXT NOT NULL, -- 'monthly', 'quarterly', 'semiannual', 'annual'
  recipients JSONB NOT NULL DEFAULT '[]', -- Emails que recebem o relatório
  frprt_categories TEXT[] NOT NULL DEFAULT '{}', -- Categorias FRPRT a incluir
  filters JSONB NOT NULL DEFAULT '{}', -- Filtros (setores, funções, etc)
  next_generation DATE NOT NULL,
  last_generated_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Tabela para avaliações de risco consolidadas (FRPRT)
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  sector_id UUID,
  role_id UUID,
  employee_id UUID,
  assessment_response_id UUID,
  
  -- Classificação FRPRT oficial
  frprt_organizacao_trabalho INTEGER NOT NULL DEFAULT 0, -- Score 0-100
  frprt_condicoes_psicossociais INTEGER NOT NULL DEFAULT 0,
  frprt_relacoes_socioprofissionais INTEGER NOT NULL DEFAULT 0,
  frprt_reconhecimento_crescimento INTEGER NOT NULL DEFAULT 0,
  frprt_equilibrio_trabalho_vida INTEGER NOT NULL DEFAULT 0,
  
  -- Classificação de exposição geral
  overall_risk_level TEXT NOT NULL, -- 'baixo', 'medio', 'alto', 'critico'
  exposure_intensity TEXT NOT NULL, -- 'baixa', 'media', 'alta', 'critica'
  
  -- Manifestações identificadas (para ações)
  manifestations_found JSONB NOT NULL DEFAULT '{}',
  
  -- Ações requeridas conforme nível
  required_actions JSONB NOT NULL DEFAULT '{}',
  action_deadline DATE, -- Prazo conforme nível de risco
  
  -- Compliance
  compliance_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  next_assessment_date DATE NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Tabela para métricas psicossociais calculadas
CREATE TABLE public.psychosocial_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  sector_id UUID,
  calculation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Estatísticas FRPRT
  total_assessments INTEGER NOT NULL DEFAULT 0,
  frprt_organizacao_alto INTEGER NOT NULL DEFAULT 0,
  frprt_condicoes_alto INTEGER NOT NULL DEFAULT 0,
  frprt_relacoes_alto INTEGER NOT NULL DEFAULT 0,
  frprt_reconhecimento_alto INTEGER NOT NULL DEFAULT 0,
  frprt_equilibrio_alto INTEGER NOT NULL DEFAULT 0,
  
  -- Níveis de exposição
  exposicao_baixa INTEGER NOT NULL DEFAULT 0,
  exposicao_media INTEGER NOT NULL DEFAULT 0,
  exposicao_alta INTEGER NOT NULL DEFAULT 0,
  exposicao_critica INTEGER NOT NULL DEFAULT 0,
  
  -- Indicadores de saúde organizacional
  taxa_absenteismo NUMERIC(5,2),
  taxa_rotatividade NUMERIC(5,2),
  indice_satisfacao NUMERIC(5,2),
  
  -- Compliance NR-01
  compliance_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  pending_actions INTEGER NOT NULL DEFAULT 0,
  overdue_actions INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Tabela para perfis de risco por setor
CREATE TABLE public.sector_risk_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  sector_id UUID NOT NULL,
  
  -- Perfil de risco predominante
  primary_frprt_category TEXT NOT NULL, -- Categoria FRPRT com maior incidência
  risk_profile TEXT NOT NULL, -- 'baixo', 'medio', 'alto', 'critico'
  
  -- Scores médios por categoria FRPRT
  avg_organizacao_trabalho NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_condicoes_psicossociais NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_relacoes_socioprofissionais NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_reconhecimento_crescimento NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_equilibrio_trabalho_vida NUMERIC(5,2) NOT NULL DEFAULT 0,
  
  -- Manifestações mais frequentes
  common_manifestations JSONB NOT NULL DEFAULT '{}',
  
  -- Recomendações específicas
  sector_recommendations JSONB NOT NULL DEFAULT '{}',
  
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assessment_count INTEGER NOT NULL DEFAULT 0
);

-- Índices para performance
CREATE INDEX idx_report_history_company_type ON report_history(company_id, report_type);
CREATE INDEX idx_scheduled_reports_next_generation ON scheduled_reports(next_generation) WHERE is_active = true;
CREATE INDEX idx_risk_assessments_company_level ON risk_assessments(company_id, overall_risk_level);
CREATE INDEX idx_risk_assessments_deadline ON risk_assessments(action_deadline) WHERE compliance_status != 'completed';
CREATE INDEX idx_psychosocial_metrics_company_date ON psychosocial_metrics(company_id, calculation_date);
CREATE INDEX idx_sector_risk_profiles_company ON sector_risk_profiles(company_id, sector_id);

-- RLS Policies
ALTER TABLE public.report_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychosocial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sector_risk_profiles ENABLE ROW LEVEL SECURITY;

-- Policies para report_history
CREATE POLICY "Users can view reports for their companies" ON public.report_history
  FOR SELECT USING (user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "Users can insert reports for their companies" ON public.report_history
  FOR INSERT WITH CHECK (user_has_company_access(company_id) OR is_superadmin());

-- Policies para scheduled_reports
CREATE POLICY "Users can manage scheduled reports for their companies" ON public.scheduled_reports
  FOR ALL USING (user_has_company_access(company_id) OR is_superadmin())
  WITH CHECK (user_has_company_access(company_id) OR is_superadmin());

-- Policies para risk_assessments
CREATE POLICY "Users can view risk assessments for their companies" ON public.risk_assessments
  FOR SELECT USING (user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "Users can manage risk assessments for their companies" ON public.risk_assessments
  FOR ALL USING (user_has_company_access(company_id) OR is_superadmin())
  WITH CHECK (user_has_company_access(company_id) OR is_superadmin());

-- Policies para psychosocial_metrics
CREATE POLICY "Users can view metrics for their companies" ON public.psychosocial_metrics
  FOR SELECT USING (user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "System can insert metrics" ON public.psychosocial_metrics
  FOR INSERT WITH CHECK (true);

-- Policies para sector_risk_profiles
CREATE POLICY "Users can view sector profiles for their companies" ON public.sector_risk_profiles
  FOR SELECT USING (user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "System can manage sector profiles" ON public.sector_risk_profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_scheduled_reports_updated_at
  BEFORE UPDATE ON public.scheduled_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_risk_assessments_updated_at
  BEFORE UPDATE ON public.risk_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();