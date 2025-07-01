
-- Criar enum para categorias de riscos psicossociais conforme NR-01 e Manual MTE
CREATE TYPE public.psychosocial_risk_category AS ENUM (
  'organizacao_trabalho',
  'condicoes_ambientais', 
  'relacoes_socioprofissionais',
  'reconhecimento_crescimento',
  'elo_trabalho_vida_social'
);

-- Criar enum para níveis de exposição psicossocial
CREATE TYPE public.psychosocial_exposure_level AS ENUM (
  'baixo',
  'medio', 
  'alto',
  'critico'
);

-- Tabela para critérios de avaliação psicossocial conforme NR-01
CREATE TABLE public.psychosocial_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  category psychosocial_risk_category NOT NULL,
  factor_name text NOT NULL,
  description text,
  weight numeric DEFAULT 1.0,
  threshold_low integer DEFAULT 30,
  threshold_medium integer DEFAULT 60,
  threshold_high integer DEFAULT 80,
  mandatory_actions jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela para análise de riscos psicossociais por setor
CREATE TABLE public.psychosocial_risk_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id),
  sector_id uuid REFERENCES public.sectors(id),
  role_id uuid REFERENCES public.roles(id),
  assessment_response_id uuid REFERENCES public.assessment_responses(id),
  category psychosocial_risk_category NOT NULL,
  exposure_level psychosocial_exposure_level NOT NULL,
  risk_score numeric NOT NULL,
  contributing_factors jsonb DEFAULT '[]'::jsonb,
  recommended_actions jsonb DEFAULT '[]'::jsonb,
  mandatory_measures jsonb DEFAULT '[]'::jsonb,
  evaluation_date date NOT NULL DEFAULT current_date,
  next_evaluation_date date,
  status text DEFAULT 'identified',
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela para templates de planos de ação conforme NR-01
CREATE TABLE public.nr01_action_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category psychosocial_risk_category NOT NULL,
  exposure_level psychosocial_exposure_level NOT NULL,
  template_name text NOT NULL,
  description text,
  mandatory_actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommended_timeline_days integer DEFAULT 90,
  responsible_roles jsonb DEFAULT '[]'::jsonb,
  legal_requirements text,
  is_mandatory boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabela para acompanhamento de conformidade NR-01
CREATE TABLE public.nr01_compliance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id),
  evaluation_period_start date NOT NULL,
  evaluation_period_end date NOT NULL,
  sectors_evaluated integer DEFAULT 0,
  employees_evaluated integer DEFAULT 0,
  high_risk_findings integer DEFAULT 0,
  action_plans_generated integer DEFAULT 0,
  action_plans_completed integer DEFAULT 0,
  compliance_percentage numeric DEFAULT 0,
  last_audit_date date,
  next_audit_date date,
  status text DEFAULT 'in_progress',
  auditor_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Função para calcular risco psicossocial baseado nas categorias NR-01
CREATE OR REPLACE FUNCTION public.calculate_psychosocial_risk(
  p_assessment_response_id uuid,
  p_company_id uuid
)
RETURNS TABLE(
  category psychosocial_risk_category,
  risk_score numeric,
  exposure_level psychosocial_exposure_level,
  recommended_actions jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  response_data jsonb;
  criteria_rec RECORD;
  calculated_score numeric;
  exposure_lvl psychosocial_exposure_level;
  actions jsonb;
BEGIN
  -- Buscar dados da resposta de avaliação
  SELECT response_data INTO response_data 
  FROM assessment_responses 
  WHERE id = p_assessment_response_id;
  
  -- Para cada categoria de risco psicossocial
  FOR criteria_rec IN 
    SELECT DISTINCT category, threshold_low, threshold_medium, threshold_high, mandatory_actions
    FROM psychosocial_criteria 
    WHERE company_id = p_company_id OR company_id IS NULL
    AND is_active = true
  LOOP
    -- Calcular score baseado nas respostas (simulação - deve ser adaptado conforme estrutura real)
    calculated_score := (response_data->>'total_score')::numeric;
    
    -- Determinar nível de exposição
    IF calculated_score <= criteria_rec.threshold_low THEN
      exposure_lvl := 'baixo';
      actions := '["Manter monitoramento periódico"]'::jsonb;
    ELSIF calculated_score <= criteria_rec.threshold_medium THEN
      exposure_lvl := 'medio';
      actions := '["Implementar medidas preventivas", "Aumentar frequência de monitoramento"]'::jsonb;
    ELSIF calculated_score <= criteria_rec.threshold_high THEN
      exposure_lvl := 'alto';
      actions := criteria_rec.mandatory_actions;
    ELSE
      exposure_lvl := 'critico';
      actions := jsonb_build_array('Implementar medidas de controle imediatas', 'Afastamento temporário se necessário') || criteria_rec.mandatory_actions;
    END IF;
    
    RETURN QUERY SELECT 
      criteria_rec.category,
      calculated_score,
      exposure_lvl,
      actions;
  END LOOP;
END;
$$;

-- Função para gerar planos de ação automáticos conforme NR-01
CREATE OR REPLACE FUNCTION public.generate_nr01_action_plan(
  p_risk_analysis_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  risk_analysis RECORD;
  template_rec RECORD;
  new_plan_id uuid;
  plan_title text;
BEGIN
  -- Buscar análise de risco
  SELECT * INTO risk_analysis
  FROM psychosocial_risk_analysis
  WHERE id = p_risk_analysis_id;
  
  -- Buscar template de ação apropriado
  SELECT * INTO template_rec
  FROM nr01_action_templates
  WHERE category = risk_analysis.category
  AND exposure_level = risk_analysis.exposure_level
  ORDER BY is_mandatory DESC, created_at DESC
  LIMIT 1;
  
  IF template_rec IS NULL THEN
    RAISE EXCEPTION 'Template de ação não encontrado para categoria % e nível %', 
      risk_analysis.category, risk_analysis.exposure_level;
  END IF;
  
  -- Criar título do plano
  plan_title := format('NR-01: %s - Nível %s', 
    template_rec.template_name, 
    UPPER(risk_analysis.exposure_level::text));
  
  -- Criar plano de ação
  INSERT INTO action_plans (
    company_id,
    title,
    description,
    status,
    priority,
    sector_id,
    start_date,
    due_date,
    risk_level,
    created_by
  ) VALUES (
    risk_analysis.company_id,
    plan_title,
    template_rec.description || E'\n\nBaseado na análise de risco psicossocial conforme NR-01.',
    'draft',
    CASE 
      WHEN risk_analysis.exposure_level IN ('alto', 'critico') THEN 'high'
      WHEN risk_analysis.exposure_level = 'medio' THEN 'medium'
      ELSE 'low'
    END,
    risk_analysis.sector_id,
    current_date,
    current_date + interval '1 day' * COALESCE(template_rec.recommended_timeline_days, 90),
    risk_analysis.exposure_level::text,
    risk_analysis.created_by
  ) RETURNING id INTO new_plan_id;
  
  RETURN new_plan_id;
END;
$$;

-- Triggers para atualização de timestamps
CREATE OR REPLACE FUNCTION update_psychosocial_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_psychosocial_criteria_updated_at
  BEFORE UPDATE ON psychosocial_criteria
  FOR EACH ROW EXECUTE FUNCTION update_psychosocial_updated_at();

CREATE TRIGGER update_psychosocial_risk_analysis_updated_at
  BEFORE UPDATE ON psychosocial_risk_analysis
  FOR EACH ROW EXECUTE FUNCTION update_psychosocial_updated_at();

CREATE TRIGGER update_nr01_action_templates_updated_at
  BEFORE UPDATE ON nr01_action_templates
  FOR EACH ROW EXECUTE FUNCTION update_psychosocial_updated_at();

CREATE TRIGGER update_nr01_compliance_updated_at
  BEFORE UPDATE ON nr01_compliance
  FOR EACH ROW EXECUTE FUNCTION update_psychosocial_updated_at();

-- Inserir critérios padrão baseados no Manual MTE
INSERT INTO psychosocial_criteria (category, factor_name, description, threshold_low, threshold_medium, threshold_high, mandatory_actions) VALUES
-- Organização do Trabalho
('organizacao_trabalho', 'Ritmo de trabalho', 'Pressão temporal e intensidade das atividades', 25, 50, 75, '["Revisar distribuição de tarefas", "Implementar pausas programadas", "Analisar cargas de trabalho"]'),
('organizacao_trabalho', 'Jornada de trabalho', 'Duração e distribuição da jornada', 25, 50, 75, '["Revisar escalas de trabalho", "Controlar horas extras", "Implementar banco de horas"]'),
('organizacao_trabalho', 'Autonomia', 'Grau de controle sobre as atividades', 25, 50, 75, '["Aumentar participação nas decisões", "Delegar responsabilidades", "Treinar lideranças"]'),

-- Condições Ambientais
('condicoes_ambientais', 'Ambiente físico', 'Condições do local de trabalho', 25, 50, 75, '["Melhorar iluminação", "Controlar ruído", "Adequar temperatura"]'),
('condicoes_ambientais', 'Equipamentos', 'Adequação e disponibilidade de recursos', 25, 50, 75, '["Fornecer equipamentos adequados", "Treinar uso de ferramentas", "Manutenção preventiva"]'),

-- Relações Socioprofissionais
('relacoes_socioprofissionais', 'Comunicação', 'Qualidade da comunicação interpessoal', 25, 50, 75, '["Treinar comunicação assertiva", "Implementar canais de comunicação", "Mediar conflitos"]'),
('relacoes_socioprofissionais', 'Liderança', 'Qualidade da gestão e supervisão', 25, 50, 75, '["Capacitar lideranças", "Implementar feedback 360", "Treinar gestão de pessoas"]'),

-- Reconhecimento e Crescimento
('reconhecimento_crescimento', 'Valorização profissional', 'Reconhecimento do trabalho realizado', 25, 50, 75, '["Implementar programa de reconhecimento", "Criar plano de carreira", "Estabelecer metas claras"]'),
('reconhecimento_crescimento', 'Capacitação', 'Oportunidades de desenvolvimento', 25, 50, 75, '["Criar plano de treinamento", "Oferecer cursos", "Estabelecer mentoria"]'),

-- Elo Trabalho-Vida Social
('elo_trabalho_vida_social', 'Conciliação', 'Equilíbrio entre trabalho e vida pessoal', 25, 50, 75, '["Implementar flexibilidade de horários", "Criar programa de bem-estar", "Oferecer suporte psicológico"]');

-- Inserir templates de ação conforme NR-01
INSERT INTO nr01_action_templates (category, exposure_level, template_name, description, mandatory_actions, recommended_timeline_days, is_mandatory) VALUES
('organizacao_trabalho', 'alto', 'Reorganização do Trabalho', 'Medidas para adequação da organização do trabalho', '["Revisar processos de trabalho", "Redistribuir cargas", "Implementar pausas obrigatórias", "Treinar supervisores"]', 60, true),
('organizacao_trabalho', 'critico', 'Intervenção Emergencial - Organização', 'Ações imediatas para controle de riscos críticos', '["Suspender atividades de risco", "Redistribuir funcionários", "Implementar monitoramento diário", "Avaliação médica dos expostos"]', 30, true),

('condicoes_ambientais', 'alto', 'Melhoria das Condições Ambientais', 'Adequação do ambiente de trabalho', '["Melhorar iluminação", "Controlar ruído", "Adequar temperatura", "Fornecer EPI adequado"]', 90, true),
('condicoes_ambientais', 'critico', 'Intervenção Emergencial - Ambiente', 'Correção imediata de condições ambientais críticas', '["Isolar área de risco", "Fornecer EPI específico", "Monitoramento contínuo", "Avaliação médica"]', 15, true),

('relacoes_socioprofissionais', 'alto', 'Melhoria das Relações Interpessoais', 'Ações para melhorar relacionamentos no trabalho', '["Treinar comunicação", "Mediar conflitos", "Capacitar lideranças", "Implementar código de conduta"]', 60, true),
('relacoes_socioprofissionais', 'critico', 'Intervenção em Conflitos Graves', 'Resolução de conflitos e situações críticas', '["Afastar envolvidos temporariamente", "Investigar denúncias", "Aplicar medidas disciplinares", "Acompanhamento psicológico"]', 30, true),

('reconhecimento_crescimento', 'alto', 'Programa de Valorização', 'Implementação de reconhecimento e desenvolvimento', '["Criar programa de reconhecimento", "Estabelecer plano de carreira", "Oferecer capacitação", "Implementar avaliação de desempenho"]', 90, false),
('reconhecimento_crescimento', 'critico', 'Recuperação da Motivação', 'Ações para casos críticos de desmotivação', '["Rever funções e responsabilidades", "Oferecer novas oportunidades", "Acompanhamento individual", "Considerar mudança de setor"]', 45, true),

('elo_trabalho_vida_social', 'alto', 'Programa de Qualidade de Vida', 'Melhoria do equilíbrio trabalho-vida', '["Implementar flexibilidade", "Criar programa de bem-estar", "Oferecer suporte familiar", "Controlar horas extras"]', 90, false),
('elo_trabalho_vida_social', 'critico', 'Suporte Emergencial', 'Apoio imediato para casos críticos', '["Reduzir jornada temporariamente", "Oferecer suporte psicológico", "Avaliar afastamento", "Acompanhar situação familiar"]', 30, true);
