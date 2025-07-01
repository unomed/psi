
-- Habilitar RLS nas tabelas que não possuem
ALTER TABLE public.risk_matrix_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychosocial_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychosocial_risk_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nr01_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nr01_action_templates ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para verificar se o usuário é superadmin (se não existir)
CREATE OR REPLACE FUNCTION public.is_superadmin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = $1 AND role = 'superadmin'
  );
$$;

-- Função auxiliar para verificar acesso à empresa (se não existir)
CREATE OR REPLACE FUNCTION public.user_has_company_access(company_id uuid, user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    public.is_superadmin($2) OR
    EXISTS (
      SELECT 1 FROM public.user_companies uc
      WHERE uc.user_id = $2 AND uc.company_id::uuid = $1
    );
$$;

-- Políticas RLS para risk_matrix_configurations
CREATE POLICY "Users can view risk matrix configs for their companies or global configs"
  ON public.risk_matrix_configurations
  FOR SELECT
  USING (
    company_id IS NULL OR 
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert risk matrix configs for their companies"
  ON public.risk_matrix_configurations
  FOR INSERT
  WITH CHECK (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update risk matrix configs for their companies"
  ON public.risk_matrix_configurations
  FOR UPDATE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Superadmins can delete risk matrix configs"
  ON public.risk_matrix_configurations
  FOR DELETE
  USING (public.is_superadmin());

-- Políticas RLS para risk_assessments
CREATE POLICY "Users can view risk assessments for their companies"
  ON public.risk_assessments
  FOR SELECT
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert risk assessments for their companies"
  ON public.risk_assessments
  FOR INSERT
  WITH CHECK (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update risk assessments for their companies"
  ON public.risk_assessments
  FOR UPDATE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can delete risk assessments for their companies"
  ON public.risk_assessments
  FOR DELETE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

-- Políticas RLS para psychosocial_criteria
CREATE POLICY "Users can view psychosocial criteria for their companies or global criteria"
  ON public.psychosocial_criteria
  FOR SELECT
  USING (
    company_id IS NULL OR 
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert psychosocial criteria for their companies"
  ON public.psychosocial_criteria
  FOR INSERT
  WITH CHECK (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update psychosocial criteria for their companies"
  ON public.psychosocial_criteria
  FOR UPDATE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Superadmins can delete psychosocial criteria"
  ON public.psychosocial_criteria
  FOR DELETE
  USING (public.is_superadmin());

-- Políticas RLS para psychosocial_risk_analysis
CREATE POLICY "Users can view psychosocial risk analysis for their companies"
  ON public.psychosocial_risk_analysis
  FOR SELECT
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert psychosocial risk analysis for their companies"
  ON public.psychosocial_risk_analysis
  FOR INSERT
  WITH CHECK (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update psychosocial risk analysis for their companies"
  ON public.psychosocial_risk_analysis
  FOR UPDATE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can delete psychosocial risk analysis for their companies"
  ON public.psychosocial_risk_analysis
  FOR DELETE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

-- Políticas RLS para nr01_compliance
CREATE POLICY "Users can view NR01 compliance for their companies"
  ON public.nr01_compliance
  FOR SELECT
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert NR01 compliance for their companies"
  ON public.nr01_compliance
  FOR INSERT
  WITH CHECK (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update NR01 compliance for their companies"
  ON public.nr01_compliance
  FOR UPDATE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can delete NR01 compliance for their companies"
  ON public.nr01_compliance
  FOR DELETE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

-- Políticas RLS para nr01_action_templates (templates globais são visíveis para todos)
CREATE POLICY "Everyone can view NR01 action templates"
  ON public.nr01_action_templates
  FOR SELECT
  USING (true);

CREATE POLICY "Only superadmins can insert NR01 action templates"
  ON public.nr01_action_templates
  FOR INSERT
  WITH CHECK (public.is_superadmin());

CREATE POLICY "Only superadmins can update NR01 action templates"
  ON public.nr01_action_templates
  FOR UPDATE
  USING (public.is_superadmin());

CREATE POLICY "Only superadmins can delete NR01 action templates"
  ON public.nr01_action_templates
  FOR DELETE
  USING (public.is_superadmin());
