
-- Remover políticas RLS redundantes e muito permissivas

-- 1. Corrigir políticas na tabela companies (remover políticas muito permissivas)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.companies;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.companies;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.companies;

-- Criar políticas mais restritivas para companies
CREATE POLICY "Users can view companies they have access to"
  ON public.companies
  FOR SELECT
  USING (
    public.is_superadmin() OR
    public.user_has_company_access(id)
  );

CREATE POLICY "Only superadmins can insert companies"
  ON public.companies
  FOR INSERT
  WITH CHECK (public.is_superadmin());

CREATE POLICY "Only superadmins can update companies"
  ON public.companies
  FOR UPDATE
  USING (public.is_superadmin());

CREATE POLICY "Only superadmins can delete companies"
  ON public.companies
  FOR DELETE
  USING (public.is_superadmin());

-- 2. Corrigir políticas na tabela employees
DROP POLICY IF EXISTS "Enable read access for all users" ON public.employees;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.employees;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.employees;

-- Criar políticas mais restritivas para employees
CREATE POLICY "Users can view employees from their companies"
  ON public.employees
  FOR SELECT
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert employees for their companies"
  ON public.employees
  FOR INSERT
  WITH CHECK (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update employees from their companies"
  ON public.employees
  FOR UPDATE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can delete employees from their companies"
  ON public.employees
  FOR DELETE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

-- 3. Corrigir políticas na tabela sectors
DROP POLICY IF EXISTS "Enable read access for all users" ON public.sectors;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.sectors;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.sectors;

CREATE POLICY "Users can view sectors from their companies"
  ON public.sectors
  FOR SELECT
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert sectors for their companies"
  ON public.sectors
  FOR INSERT
  WITH CHECK (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update sectors from their companies"
  ON public.sectors
  FOR UPDATE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can delete sectors from their companies"
  ON public.sectors
  FOR DELETE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

-- 4. Corrigir políticas na tabela roles
DROP POLICY IF EXISTS "Enable read access for all users" ON public.roles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.roles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.roles;

CREATE POLICY "Users can view roles from their companies"
  ON public.roles
  FOR SELECT
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert roles for their companies"
  ON public.roles
  FOR INSERT
  WITH CHECK (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update roles from their companies"
  ON public.roles
  FOR UPDATE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can delete roles from their companies"
  ON public.roles
  FOR DELETE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

-- 5. Adicionar políticas RLS para tabelas que não possuem nenhuma
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view templates for their companies or global templates"
  ON public.checklist_templates
  FOR SELECT
  USING (
    company_id IS NULL OR 
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert templates for their companies"
  ON public.checklist_templates
  FOR INSERT
  WITH CHECK (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update templates for their companies"
  ON public.checklist_templates
  FOR UPDATE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can delete templates for their companies"
  ON public.checklist_templates
  FOR DELETE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

-- 6. Corrigir políticas muito permissivas em assessment_responses
DROP POLICY IF EXISTS "Enable read access for all users" ON public.assessment_responses;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.assessment_responses;

-- Função auxiliar para verificar acesso a assessment_responses via employee
CREATE OR REPLACE FUNCTION public.user_has_assessment_access(assessment_id uuid, user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    public.is_superadmin($2) OR
    EXISTS (
      SELECT 1 FROM public.assessment_responses ar
      JOIN public.employees e ON ar.employee_id = e.id
      WHERE ar.id = $1 AND public.user_has_company_access(e.company_id, $2)
    );
$$;

CREATE POLICY "Users can view assessment responses for their companies"
  ON public.assessment_responses
  FOR SELECT
  USING (
    public.user_has_assessment_access(id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert assessment responses for their companies"
  ON public.assessment_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = employee_id AND public.user_has_company_access(e.company_id)
    ) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update assessment responses for their companies"
  ON public.assessment_responses
  FOR UPDATE
  USING (
    public.user_has_assessment_access(id) OR
    public.is_superadmin()
  );

-- 7. Habilitar RLS em tabelas críticas que não possuem
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plan_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view action plans for their companies"
  ON public.action_plans
  FOR SELECT
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert action plans for their companies"
  ON public.action_plans
  FOR INSERT
  WITH CHECK (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update action plans for their companies"
  ON public.action_plans
  FOR UPDATE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can delete action plans for their companies"
  ON public.action_plans
  FOR DELETE
  USING (
    public.user_has_company_access(company_id) OR
    public.is_superadmin()
  );

-- Função auxiliar para verificar acesso a action_plan_items via action_plan
CREATE OR REPLACE FUNCTION public.user_has_action_plan_item_access(item_id uuid, user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    public.is_superadmin($2) OR
    EXISTS (
      SELECT 1 FROM public.action_plan_items api
      JOIN public.action_plans ap ON api.action_plan_id = ap.id
      WHERE api.id = $1 AND public.user_has_company_access(ap.company_id, $2)
    );
$$;

CREATE POLICY "Users can view action plan items for their companies"
  ON public.action_plan_items
  FOR SELECT
  USING (
    public.user_has_action_plan_item_access(id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can insert action plan items for their companies"
  ON public.action_plan_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.action_plans ap
      WHERE ap.id = action_plan_id AND public.user_has_company_access(ap.company_id)
    ) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can update action plan items for their companies"
  ON public.action_plan_items
  FOR UPDATE
  USING (
    public.user_has_action_plan_item_access(id) OR
    public.is_superadmin()
  );

CREATE POLICY "Users can delete action plan items for their companies"
  ON public.action_plan_items
  FOR DELETE
  USING (
    public.user_has_action_plan_item_access(id) OR
    public.is_superadmin()
  );
