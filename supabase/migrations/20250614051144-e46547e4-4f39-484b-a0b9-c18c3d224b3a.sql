
-- Criar tabela para pesos de categorias psicossociais
CREATE TABLE public.psychosocial_category_weights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  weight NUMERIC NOT NULL DEFAULT 1.0,
  critical_threshold INTEGER NOT NULL DEFAULT 80,
  high_threshold INTEGER NOT NULL DEFAULT 60,
  medium_threshold INTEGER NOT NULL DEFAULT 40,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, category)
);

-- Criar tabela para perfis de risco por setor
CREATE TABLE public.sector_risk_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  sector_id UUID NOT NULL REFERENCES public.sectors(id) ON DELETE CASCADE,
  risk_multipliers JSONB NOT NULL DEFAULT '{}',
  baseline_scores JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, sector_id)
);

-- Criar tabela para jobs de processamento
CREATE TABLE public.psychosocial_processing_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_response_id UUID NOT NULL REFERENCES public.assessment_responses(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3
);

-- Adicionar RLS policies
ALTER TABLE public.psychosocial_category_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sector_risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychosocial_processing_jobs ENABLE ROW LEVEL SECURITY;

-- Policies básicas (podem ser refinadas depois)
CREATE POLICY "Enable all for authenticated users" ON public.psychosocial_category_weights FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.sector_risk_profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.psychosocial_processing_jobs FOR ALL USING (auth.role() = 'authenticated');

-- Triggers para updated_at
CREATE TRIGGER update_psychosocial_category_weights_updated_at
  BEFORE UPDATE ON public.psychosocial_category_weights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sector_risk_profiles_updated_at
  BEFORE UPDATE ON public.sector_risk_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
