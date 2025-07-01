
-- Criar tabela action_plans
CREATE TABLE public.action_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  assessment_response_id uuid REFERENCES public.assessment_responses(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  responsible_user_id uuid,
  department text,
  start_date date,
  due_date date,
  completion_date date,
  progress_percentage integer NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  risk_level text CHECK (risk_level IN ('low', 'medium', 'high')),
  budget_allocated decimal(10,2),
  budget_used decimal(10,2) DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela action_plan_items
CREATE TABLE public.action_plan_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_plan_id uuid NOT NULL REFERENCES public.action_plans(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  responsible_name text,
  responsible_email text,
  department text,
  estimated_hours integer,
  actual_hours integer,
  start_date date,
  due_date date,
  completion_date date,
  progress_percentage integer NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  dependencies text[],
  notes text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plan_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para action_plans
CREATE POLICY "Users can view action plans from their companies" 
  ON public.action_plans 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_companies uc 
      WHERE uc.user_id = auth.uid() AND uc.company_id::uuid = action_plans.company_id
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

CREATE POLICY "Users can create action plans for their companies" 
  ON public.action_plans 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_companies uc 
      WHERE uc.user_id = auth.uid() AND uc.company_id::uuid = action_plans.company_id
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

CREATE POLICY "Users can update action plans from their companies" 
  ON public.action_plans 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_companies uc 
      WHERE uc.user_id = auth.uid() AND uc.company_id::uuid = action_plans.company_id
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

CREATE POLICY "Users can delete action plans from their companies" 
  ON public.action_plans 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_companies uc 
      WHERE uc.user_id = auth.uid() AND uc.company_id::uuid = action_plans.company_id
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

-- Políticas RLS para action_plan_items
CREATE POLICY "Users can view action plan items from their companies" 
  ON public.action_plan_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.action_plans ap
      JOIN public.user_companies uc ON uc.company_id::uuid = ap.company_id
      WHERE ap.id = action_plan_items.action_plan_id AND uc.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

CREATE POLICY "Users can create action plan items for their companies" 
  ON public.action_plan_items 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.action_plans ap
      JOIN public.user_companies uc ON uc.company_id::uuid = ap.company_id
      WHERE ap.id = action_plan_items.action_plan_id AND uc.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

CREATE POLICY "Users can update action plan items from their companies" 
  ON public.action_plan_items 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.action_plans ap
      JOIN public.user_companies uc ON uc.company_id::uuid = ap.company_id
      WHERE ap.id = action_plan_items.action_plan_id AND uc.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

CREATE POLICY "Users can delete action plan items from their companies" 
  ON public.action_plan_items 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.action_plans ap
      JOIN public.user_companies uc ON uc.company_id::uuid = ap.company_id
      WHERE ap.id = action_plan_items.action_plan_id AND uc.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
    )
  );

-- Criar índices para melhor performance
CREATE INDEX idx_action_plans_company_id ON public.action_plans(company_id);
CREATE INDEX idx_action_plans_status ON public.action_plans(status);
CREATE INDEX idx_action_plans_created_at ON public.action_plans(created_at);
CREATE INDEX idx_action_plan_items_action_plan_id ON public.action_plan_items(action_plan_id);
CREATE INDEX idx_action_plan_items_status ON public.action_plan_items(status);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_action_plans_updated_at
  BEFORE UPDATE ON public.action_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_action_plan_items_updated_at
  BEFORE UPDATE ON public.action_plan_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
