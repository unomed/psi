-- PHASE 1: Critical RLS Security Fix
-- Re-enable RLS on assessment_responses with proper policies
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies for assessment_responses
DROP POLICY IF EXISTS "Allow active employees to insert assessment responses" ON public.assessment_responses;
DROP POLICY IF EXISTS "Allow update assessment responses simplified" ON public.assessment_responses;
DROP POLICY IF EXISTS "Allow view assessment responses simplified" ON public.assessment_responses;

-- Policy for employees to insert their own assessment responses
CREATE POLICY "Employees can create their own assessment responses" ON public.assessment_responses
FOR INSERT 
WITH CHECK (
  -- Employee can only create responses for themselves
  employee_id::text = current_setting('app.current_employee_id', true)
  OR 
  -- Or if authenticated user has company access
  (auth.uid() IS NOT NULL AND user_has_company_access(
    (SELECT company_id FROM employees WHERE id = employee_id)
  ))
);

-- Policy for viewing assessment responses
CREATE POLICY "View assessment responses with proper access" ON public.assessment_responses
FOR SELECT 
USING (
  -- Employee can view their own responses
  employee_id::text = current_setting('app.current_employee_id', true)
  OR
  -- Authenticated users can view responses from their companies
  (auth.uid() IS NOT NULL AND user_has_company_access(
    (SELECT company_id FROM employees WHERE id = employee_id)
  ))
  OR
  -- Superadmins can view all
  is_superadmin()
);

-- Policy for updating assessment responses
CREATE POLICY "Update assessment responses with proper access" ON public.assessment_responses
FOR UPDATE 
USING (
  -- Employee can update their own incomplete responses
  (employee_id::text = current_setting('app.current_employee_id', true) AND completed_at IS NULL)
  OR
  -- Authenticated users can update responses from their companies
  (auth.uid() IS NOT NULL AND user_has_company_access(
    (SELECT company_id FROM employees WHERE id = employee_id)
  ))
  OR
  -- Superadmins can update all
  is_superadmin()
);

-- PHASE 2: Secure Employee Authentication System
-- Create table for employee credentials with proper hashing
CREATE TABLE IF NOT EXISTS public.employee_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id)
);

-- Enable RLS on employee_credentials
ALTER TABLE public.employee_credentials ENABLE ROW LEVEL SECURITY;

-- RLS policies for employee_credentials (very restrictive)
CREATE POLICY "Only system can manage employee credentials" ON public.employee_credentials
FOR ALL USING (false) WITH CHECK (false);

-- Create function for secure employee authentication
CREATE OR REPLACE FUNCTION public.authenticate_employee(
  p_cpf TEXT,
  p_password TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_employee RECORD;
  v_credentials RECORD;
  v_is_valid BOOLEAN := false;
  v_password_hash TEXT;
  v_attempts INTEGER;
BEGIN
  -- Rate limiting check
  SELECT failed_login_attempts, locked_until INTO v_attempts, locked_until
  FROM employee_credentials ec
  JOIN employees e ON ec.employee_id = e.id
  WHERE e.cpf = p_cpf;
  
  -- Check if account is locked
  IF v_attempts >= 5 AND (locked_until IS NULL OR locked_until > NOW()) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Account temporarily locked due to failed login attempts',
      'locked_until', locked_until
    );
  END IF;
  
  -- Get employee data
  SELECT e.*, ec.password_hash, ec.salt
  INTO v_employee
  FROM employees e
  LEFT JOIN employee_credentials ec ON e.id = ec.employee_id
  WHERE e.cpf = p_cpf AND e.status = 'active' AND e.employee_type = 'funcionario';
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
  
  -- If no credentials exist, create them with current password logic (temporary migration)
  IF v_employee.password_hash IS NULL THEN
    -- Generate salt and hash the temporary password (last 4 digits of CPF)
    v_password_hash := crypt(p_password, gen_salt('bf', 12));
    
    INSERT INTO employee_credentials (employee_id, password_hash, salt)
    VALUES (v_employee.id, v_password_hash, gen_salt('bf'));
    
    v_is_valid := (p_password = RIGHT(p_cpf, 4));
  ELSE
    -- Verify password using proper hashing
    v_is_valid := (v_employee.password_hash = crypt(p_password, v_employee.password_hash));
  END IF;
  
  IF v_is_valid THEN
    -- Reset failed attempts and update last login
    UPDATE employee_credentials 
    SET failed_login_attempts = 0, 
        locked_until = NULL,
        last_login = NOW()
    WHERE employee_id = v_employee.id;
    
    -- Set session variable for employee
    PERFORM set_employee_session(v_employee.id);
    
    RETURN jsonb_build_object(
      'success', true,
      'employee', jsonb_build_object(
        'id', v_employee.id,
        'name', v_employee.name,
        'cpf', v_employee.cpf,
        'company_id', v_employee.company_id
      )
    );
  ELSE
    -- Increment failed attempts
    UPDATE employee_credentials 
    SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
        locked_until = CASE 
          WHEN COALESCE(failed_login_attempts, 0) + 1 >= 5 
          THEN NOW() + INTERVAL '30 minutes'
          ELSE NULL 
        END
    WHERE employee_id = v_employee.id;
    
    RETURN jsonb_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
END;
$$;

-- Create function to change employee password
CREATE OR REPLACE FUNCTION public.change_employee_password(
  p_employee_id UUID,
  p_current_password TEXT,
  p_new_password TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_credentials RECORD;
  v_new_hash TEXT;
BEGIN
  -- Validate current password
  SELECT password_hash INTO v_credentials
  FROM employee_credentials
  WHERE employee_id = p_employee_id;
  
  IF NOT FOUND OR v_credentials.password_hash != crypt(p_current_password, v_credentials.password_hash) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Current password is incorrect');
  END IF;
  
  -- Validate new password strength
  IF LENGTH(p_new_password) < 8 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Password must be at least 8 characters long');
  END IF;
  
  -- Hash new password
  v_new_hash := crypt(p_new_password, gen_salt('bf', 12));
  
  -- Update password
  UPDATE employee_credentials 
  SET password_hash = v_new_hash,
      password_changed_at = NOW(),
      failed_login_attempts = 0,
      locked_until = NULL
  WHERE employee_id = p_employee_id;
  
  RETURN jsonb_build_object('success', true, 'message', 'Password changed successfully');
END;
$$;

-- Create audit log function for security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_employee_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::jsonb,
  p_ip_address INET DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    action_type,
    module,
    resource_type,
    resource_id,
    description,
    metadata,
    ip_address,
    company_id
  ) VALUES (
    'security_event'::audit_action_type,
    'authentication'::audit_module,
    'employee_login',
    p_employee_id::text,
    p_event_type,
    p_details,
    p_ip_address,
    (SELECT company_id FROM employees WHERE id = p_employee_id)
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Create trigger to update employee_credentials updated_at
CREATE OR REPLACE FUNCTION public.update_employee_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_employee_credentials_updated_at
  BEFORE UPDATE ON public.employee_credentials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_employee_credentials_updated_at();