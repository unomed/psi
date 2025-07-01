
-- Function to get all employees from a specific company
CREATE OR REPLACE FUNCTION public.get_employees_by_company(company_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id FROM public.employees 
  WHERE company_id = get_employees_by_company.company_id;
$$;
