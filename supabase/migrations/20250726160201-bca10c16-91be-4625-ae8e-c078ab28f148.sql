-- Create RLS policy to allow employees to view their company information
CREATE POLICY "Employees can view their company information"
ON public.companies
FOR SELECT
USING (
  -- Allow if employee session is set and company matches
  id::text = current_setting('app.current_employee_company_id', true)
  OR
  -- Allow if there's an employee in the current company context
  EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.company_id = companies.id 
    AND e.id::text = current_setting('app.current_employee_id', true)
  )
);

-- Update the set_employee_session function to also set company context
CREATE OR REPLACE FUNCTION public.set_employee_session(employee_id_value uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  employee_record RECORD;
BEGIN
  -- Get employee with company information
  SELECT e.*, e.company_id
  INTO employee_record
  FROM employees e
  WHERE e.id = employee_id_value;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Employee not found: %', employee_id_value;
  END IF;
  
  -- Configure session variables for employee identification
  PERFORM set_config('app.current_employee_id', employee_id_value::text, false);
  PERFORM set_config('app.current_employee_company_id', employee_record.company_id::text, false);
  
  -- Also configure the CPF for compatibility with existing policies
  PERFORM set_config('app.current_employee_cpf', employee_record.cpf, false);
END;
$$;