
-- Adicionar políticas RLS para tabelas que ainda não possuem

-- Política para employees
CREATE POLICY "Users can view employees from accessible companies"
ON employees FOR SELECT
TO authenticated
USING (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
);

CREATE POLICY "Users can insert employees in accessible companies"
ON employees FOR INSERT
TO authenticated
WITH CHECK (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
);

CREATE POLICY "Users can update employees in accessible companies"
ON employees FOR UPDATE
TO authenticated
USING (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
)
WITH CHECK (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
);

-- Política para roles
CREATE POLICY "Users can view roles from accessible companies"
ON roles FOR SELECT
TO authenticated
USING (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
);

CREATE POLICY "Admins can manage roles"
ON roles FOR ALL
TO authenticated
USING (
  public.is_superadmin(auth.uid()) OR
  (public.has_role(auth.uid(), 'admin') AND public.user_has_company_access(company_id, auth.uid()))
)
WITH CHECK (
  public.is_superadmin(auth.uid()) OR
  (public.has_role(auth.uid(), 'admin') AND public.user_has_company_access(company_id, auth.uid()))
);

-- Política para sectors
CREATE POLICY "Users can view sectors from accessible companies"
ON sectors FOR SELECT
TO authenticated
USING (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
);

CREATE POLICY "Admins can manage sectors"
ON sectors FOR ALL
TO authenticated
USING (
  public.is_superadmin(auth.uid()) OR
  (public.has_role(auth.uid(), 'admin') AND public.user_has_company_access(company_id, auth.uid()))
)
WITH CHECK (
  public.is_superadmin(auth.uid()) OR
  (public.has_role(auth.uid(), 'admin') AND public.user_has_company_access(company_id, auth.uid()))
);

-- Política para assessment_responses
CREATE POLICY "Users can view assessments from accessible companies"
ON assessment_responses FOR SELECT
TO authenticated
USING (
  public.is_superadmin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM employees e
    WHERE e.id = assessment_responses.employee_id
    AND public.user_has_company_access(e.company_id, auth.uid())
  )
);

CREATE POLICY "Users can create assessments for accessible employees"
ON assessment_responses FOR INSERT
TO authenticated
WITH CHECK (
  public.is_superadmin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM employees e
    WHERE e.id = assessment_responses.employee_id
    AND public.user_has_company_access(e.company_id, auth.uid())
  )
);

-- Política para action_plans
CREATE POLICY "Users can view action plans from accessible companies"
ON action_plans FOR SELECT
TO authenticated
USING (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
);

CREATE POLICY "Users can manage action plans for accessible companies"
ON action_plans FOR ALL
TO authenticated
USING (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
)
WITH CHECK (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
);

-- Política para psychosocial_risk_analysis
CREATE POLICY "Users can view risk analysis from accessible companies"
ON psychosocial_risk_analysis FOR SELECT
TO authenticated
USING (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
);

CREATE POLICY "Users can manage risk analysis for accessible companies"
ON psychosocial_risk_analysis FOR ALL
TO authenticated
USING (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
)
WITH CHECK (
  public.is_superadmin(auth.uid()) OR
  public.user_has_company_access(company_id, auth.uid())
);

-- Habilitar RLS nas tabelas que ainda não têm
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychosocial_risk_analysis ENABLE ROW LEVEL SECURITY;

-- Comentários para documentação
COMMENT ON POLICY "Users can view employees from accessible companies" ON employees 
IS 'Permite visualizar funcionários apenas das empresas que o usuário tem acesso';

COMMENT ON POLICY "Users can view roles from accessible companies" ON roles 
IS 'Permite visualizar funções apenas das empresas que o usuário tem acesso';

COMMENT ON POLICY "Users can view sectors from accessible companies" ON sectors 
IS 'Permite visualizar setores apenas das empresas que o usuário tem acesso';
