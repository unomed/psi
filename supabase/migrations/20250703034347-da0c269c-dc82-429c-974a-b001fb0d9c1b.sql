-- Fix remaining Function Search Path Mutable security issues - Part 2
-- Setting search_path = 'public' for remaining functions with corrected signatures

-- Try different function signatures that might exist
DO $$
BEGIN
    -- Try to set search_path for functions that might exist with different signatures
    BEGIN
        ALTER FUNCTION public.calculate_psychosocial_risk(uuid, uuid) SET search_path = 'public';
    EXCEPTION WHEN undefined_function THEN
        NULL; -- Function doesn't exist, skip
    END;
    
    BEGIN
        ALTER FUNCTION public.get_current_employee_id() SET search_path = 'public';
    EXCEPTION WHEN undefined_function THEN
        NULL; -- Function doesn't exist, skip
    END;
    
    BEGIN
        ALTER FUNCTION public.set_employee_session(text) SET search_path = 'public';
    EXCEPTION WHEN undefined_function THEN
        NULL; -- Function doesn't exist, skip
    END;
    
    BEGIN
        ALTER FUNCTION public.update_dashboard_timestamp() SET search_path = 'public';
    EXCEPTION WHEN undefined_function THEN
        NULL; -- Function doesn't exist, skip
    END;
    
    BEGIN
        ALTER FUNCTION public.get_dashboard_analytics(uuid) SET search_path = 'public';
    EXCEPTION WHEN undefined_function THEN
        NULL; -- Function doesn't exist, skip
    END;
    
    BEGIN
        ALTER FUNCTION public.calculate_psychosocial_metrics(uuid) SET search_path = 'public';
    EXCEPTION WHEN undefined_function THEN
        NULL; -- Function doesn't exist, skip
    END;
END $$;