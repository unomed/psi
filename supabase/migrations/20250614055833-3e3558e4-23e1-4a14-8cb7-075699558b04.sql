
-- Primeiro, vamos verificar se a tabela nr01_action_templates existe e adicionar colunas necessárias
DO $$ 
BEGIN
    -- Adicionar coluna template_actions se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nr01_action_templates' 
        AND column_name = 'template_actions'
    ) THEN
        ALTER TABLE public.nr01_action_templates 
        ADD COLUMN template_actions JSONB NOT NULL DEFAULT '[]';
    END IF;
    
    -- Adicionar outras colunas necessárias se não existirem
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nr01_action_templates' 
        AND column_name = 'legal_requirements'
    ) THEN
        ALTER TABLE public.nr01_action_templates 
        ADD COLUMN legal_requirements TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nr01_action_templates' 
        AND column_name = 'responsible_roles'
    ) THEN
        ALTER TABLE public.nr01_action_templates 
        ADD COLUMN responsible_roles JSONB DEFAULT '[]';
    END IF;
END $$;

-- Criar tabela para perfis de risco por setor (se não existir)
CREATE TABLE IF NOT EXISTS public.sector_risk_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  risk_multipliers JSONB NOT NULL DEFAULT '{}',
  baseline_scores JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, sector_id)
);

-- Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_action_templates_category_level ON public.nr01_action_templates(category, exposure_level);
CREATE INDEX IF NOT EXISTS idx_sector_profiles_company_sector ON public.sector_risk_profiles(company_id, sector_id);

-- Inserir templates básicos de ação NR-01 (apenas se não existirem)
INSERT INTO public.nr01_action_templates (template_name, category, exposure_level, description, is_mandatory, recommended_timeline_days, template_actions) 
SELECT 
    template_name, 
    category, 
    exposure_level, 
    description, 
    is_mandatory, 
    recommended_timeline_days, 
    template_actions
FROM (VALUES
  ('Intervenção Crítica - Organização do Trabalho', 'organizacao_trabalho'::psychosocial_risk_category, 'critico'::psychosocial_exposure_level, 'Medidas imediatas para redução de sobrecarga e reorganização das tarefas', true, 7, '[
    {"title": "Redistribuição imediata de tarefas", "description": "Reduzir carga de trabalho em 30%", "mandatory": true, "timeline_days": 1, "responsible_role": "Gestor Direto", "estimated_hours": 8},
    {"title": "Avaliação médica ocupacional", "description": "Encaminhar para avaliação médica especializada", "mandatory": true, "timeline_days": 3, "responsible_role": "RH/SESMT", "estimated_hours": 4},
    {"title": "Plano de retorno gradual", "description": "Estabelecer cronograma de retorno às atividades", "mandatory": true, "timeline_days": 7, "responsible_role": "RH/Médico", "estimated_hours": 6}
  ]'::jsonb),
  ('Medidas Preventivas - Condições Ambientais', 'condicoes_ambientais'::psychosocial_risk_category, 'alto'::psychosocial_exposure_level, 'Melhorias no ambiente físico de trabalho', false, 30, '[
    {"title": "Avaliação ergonômica", "description": "Análise completa das condições do posto de trabalho", "mandatory": false, "timeline_days": 15, "responsible_role": "SESMT", "estimated_hours": 12},
    {"title": "Adequação mobiliário", "description": "Ajuste ou substituição de móveis e equipamentos", "mandatory": false, "timeline_days": 30, "responsible_role": "Facilities", "estimated_hours": 20},
    {"title": "Treinamento ergonômico", "description": "Capacitação sobre postura e organização do trabalho", "mandatory": false, "timeline_days": 20, "responsible_role": "RH", "estimated_hours": 4}
  ]'::jsonb),
  ('Monitoramento - Relações Socioprofissionais', 'relacoes_socioprofissionais'::psychosocial_risk_category, 'medio'::psychosocial_exposure_level, 'Acompanhamento das relações interpessoais', false, 60, '[
    {"title": "Reuniões de feedback", "description": "Estabelecer reuniões periódicas com a equipe", "mandatory": false, "timeline_days": 30, "responsible_role": "Gestor", "estimated_hours": 8},
    {"title": "Treinamento comunicação", "description": "Capacitação em comunicação assertiva", "mandatory": false, "timeline_days": 45, "responsible_role": "RH", "estimated_hours": 16},
    {"title": "Canal de comunicação", "description": "Implementar canal direto para sugestões", "mandatory": false, "timeline_days": 15, "responsible_role": "RH", "estimated_hours": 4}
  ]'::jsonb)
) AS new_templates(template_name, category, exposure_level, description, is_mandatory, recommended_timeline_days, template_actions)
WHERE NOT EXISTS (
  SELECT 1 FROM public.nr01_action_templates 
  WHERE template_name = new_templates.template_name
);

-- Habilitar RLS nas tabelas
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nr01_action_templates') THEN
        ALTER TABLE public.nr01_action_templates ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sector_risk_profiles') THEN
        ALTER TABLE public.sector_risk_profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Políticas RLS para templates de ação
DROP POLICY IF EXISTS "Everyone can view action templates" ON public.nr01_action_templates;
CREATE POLICY "Everyone can view action templates" 
  ON public.nr01_action_templates 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "System can manage action templates" ON public.nr01_action_templates;
CREATE POLICY "System can manage action templates" 
  ON public.nr01_action_templates 
  FOR ALL 
  USING (true);

-- Políticas RLS para perfis de setor
DROP POLICY IF EXISTS "Companies can view their sector profiles" ON public.sector_risk_profiles;
CREATE POLICY "Companies can view their sector profiles" 
  ON public.sector_risk_profiles 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Companies can manage their sector profiles" ON public.sector_risk_profiles;
CREATE POLICY "Companies can manage their sector profiles" 
  ON public.sector_risk_profiles 
  FOR ALL 
  USING (true);

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_nr01_action_templates_updated_at ON public.nr01_action_templates;
CREATE TRIGGER update_nr01_action_templates_updated_at
  BEFORE UPDATE ON public.nr01_action_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_psychosocial_updated_at();

DROP TRIGGER IF EXISTS update_sector_risk_profiles_updated_at ON public.sector_risk_profiles;
CREATE TRIGGER update_sector_risk_profiles_updated_at
  BEFORE UPDATE ON public.sector_risk_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_psychosocial_updated_at();
