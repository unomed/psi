-- Fix the authenticate_employee function to handle company lookup properly
CREATE OR REPLACE FUNCTION public.authenticate_employee(p_cpf text, p_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_employee RECORD;
  v_credentials RECORD;
  v_is_valid BOOLEAN := false;
  v_attempts INTEGER;
  v_locked_until TIMESTAMP WITH TIME ZONE;
  v_clean_cpf TEXT;
  v_company_name TEXT;
BEGIN
  -- Clean CPF (remove dots and dashes)
  v_clean_cpf := regexp_replace(p_cpf, '[^0-9]', '', 'g');
  
  -- Rate limiting check
  SELECT failed_login_attempts, locked_until 
  INTO v_attempts, v_locked_until
  FROM employee_credentials ec
  JOIN employees e ON ec.employee_id = e.id
  WHERE regexp_replace(e.cpf, '[^0-9]', '', 'g') = v_clean_cpf;
  
  -- Check if account is locked
  IF v_attempts >= 5 AND (v_locked_until IS NULL OR v_locked_until > NOW()) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Account temporarily locked due to failed login attempts',
      'locked_until', v_locked_until
    );
  END IF;
  
  -- Get employee data with company name (using JOIN to get company name directly)
  SELECT e.*, ec.password_hash, ec.salt, c.name as company_name
  INTO v_employee
  FROM employees e
  LEFT JOIN employee_credentials ec ON e.id = ec.employee_id
  JOIN companies c ON e.company_id = c.id  -- Direct JOIN instead of separate query
  WHERE regexp_replace(e.cpf, '[^0-9]', '', 'g') = v_clean_cpf 
    AND e.status = 'active' 
    AND e.employee_type = 'funcionario';
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
  
  -- Temporary password validation (using last 4 digits of CPF)
  -- This will be updated once pgcrypto is properly configured
  IF v_employee.password_hash IS NULL THEN
    -- First time login - validate using last 4 digits of clean CPF
    v_is_valid := (p_password = RIGHT(v_clean_cpf, 4));
    
    -- Store a simple hash indicator for future use
    IF v_is_valid THEN
      INSERT INTO employee_credentials (employee_id, password_hash, salt, failed_login_attempts, last_login)
      VALUES (v_employee.id, 'temp_' || p_password, 'temp_salt', 0, NOW())
      ON CONFLICT (employee_id) 
      DO UPDATE SET 
        password_hash = 'temp_' || p_password,
        failed_login_attempts = 0, 
        locked_until = NULL,
        last_login = NOW();
    END IF;
  ELSE
    -- Check existing simple hash
    v_is_valid := (v_employee.password_hash = 'temp_' || p_password);
  END IF;
  
  IF v_is_valid THEN
    -- Reset failed attempts and update last login
    INSERT INTO employee_credentials (employee_id, password_hash, salt, failed_login_attempts, last_login)
    VALUES (v_employee.id, 'temp_' || p_password, 'temp_salt', 0, NOW())
    ON CONFLICT (employee_id) 
    DO UPDATE SET 
      failed_login_attempts = 0, 
      locked_until = NULL,
      last_login = NOW();
    
    -- Set session variable for employee
    PERFORM set_employee_session(v_employee.id);
    
    RETURN jsonb_build_object(
      'success', true,
      'employee', jsonb_build_object(
        'id', v_employee.id,
        'name', v_employee.name,
        'cpf', v_employee.cpf,
        'company_id', v_employee.company_id,
        'company_name', v_employee.company_name  -- Return company name directly
      )
    );
  ELSE
    -- Increment failed attempts
    INSERT INTO employee_credentials (employee_id, failed_login_attempts, locked_until)
    VALUES (v_employee.id, 1, CASE WHEN 1 >= 5 THEN NOW() + INTERVAL '30 minutes' ELSE NULL END)
    ON CONFLICT (employee_id)
    DO UPDATE SET 
      failed_login_attempts = COALESCE(employee_credentials.failed_login_attempts, 0) + 1,
      locked_until = CASE 
        WHEN COALESCE(employee_credentials.failed_login_attempts, 0) + 1 >= 5 
        THEN NOW() + INTERVAL '30 minutes'
        ELSE NULL 
      END;
    
    RETURN jsonb_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
END;
$$;