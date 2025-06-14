
-- Create psychosocial_risk_config table
CREATE TABLE public.psychosocial_risk_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  threshold_low INTEGER NOT NULL DEFAULT 25,
  threshold_medium INTEGER NOT NULL DEFAULT 50,
  threshold_high INTEGER NOT NULL DEFAULT 75,
  periodicidade_dias INTEGER NOT NULL DEFAULT 180,
  prazo_acao_critica_dias INTEGER NOT NULL DEFAULT 7,
  prazo_acao_alta_dias INTEGER NOT NULL DEFAULT 30,
  auto_generate_plans BOOLEAN NOT NULL DEFAULT true,
  notification_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- Add RLS policies
ALTER TABLE public.psychosocial_risk_config ENABLE ROW LEVEL SECURITY;

-- Create policies for company access
CREATE POLICY "Companies can view their own config" 
  ON public.psychosocial_risk_config 
  FOR SELECT 
  USING (true); -- Allow read access for now

CREATE POLICY "Companies can insert their own config" 
  ON public.psychosocial_risk_config 
  FOR INSERT 
  WITH CHECK (true); -- Allow insert for now

CREATE POLICY "Companies can update their own config" 
  ON public.psychosocial_risk_config 
  FOR UPDATE 
  USING (true); -- Allow update for now

-- Add trigger for updated_at
CREATE TRIGGER update_psychosocial_risk_config_updated_at
  BEFORE UPDATE ON public.psychosocial_risk_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_psychosocial_updated_at();
