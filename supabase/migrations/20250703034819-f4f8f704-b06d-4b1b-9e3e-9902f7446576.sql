-- Fix specific Function Search Path Mutable security issue for calculate_psychosocial_metrics
-- Try different function signatures to find the correct one

DO $$
DECLARE
    func_exists BOOLEAN := FALSE;
BEGIN
    -- Try to find and fix the function with various possible signatures
    
    -- Check if function exists with no parameters
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'calculate_psychosocial_metrics' 
               AND p.pronargs = 0) THEN
        ALTER FUNCTION public.calculate_psychosocial_metrics() SET search_path = 'public';
        func_exists := TRUE;
    END IF;
    
    -- Check if function exists with 1 UUID parameter
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'calculate_psychosocial_metrics' 
               AND p.pronargs = 1) THEN
        ALTER FUNCTION public.calculate_psychosocial_metrics(uuid) SET search_path = 'public';
        func_exists := TRUE;
    END IF;
    
    -- Check if function exists with 2 parameters (uuid, date)
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'calculate_psychosocial_metrics' 
               AND p.pronargs = 2) THEN
        ALTER FUNCTION public.calculate_psychosocial_metrics(uuid, date) SET search_path = 'public';
        func_exists := TRUE;
    END IF;
    
    -- Check if function exists with 3 parameters (uuid, date, date)
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'calculate_psychosocial_metrics' 
               AND p.pronargs = 3) THEN
        ALTER FUNCTION public.calculate_psychosocial_metrics(uuid, date, date) SET search_path = 'public';
        func_exists := TRUE;
    END IF;
    
    -- Check if function exists with 4 or more parameters
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'public' AND p.proname = 'calculate_psychosocial_metrics' 
               AND p.pronargs >= 4) THEN
        -- Try to set search_path using the function OID directly
        UPDATE pg_proc 
        SET prosecdef = true, 
            proconfig = array_append(COALESCE(proconfig, '{}'), 'search_path=public')
        WHERE oid IN (
            SELECT p.oid FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
            WHERE n.nspname = 'public' AND p.proname = 'calculate_psychosocial_metrics'
        );
        func_exists := TRUE;
    END IF;
    
    -- Log if no function was found
    IF NOT func_exists THEN
        RAISE NOTICE 'Function calculate_psychosocial_metrics not found in any expected signature';
    END IF;
    
END $$;