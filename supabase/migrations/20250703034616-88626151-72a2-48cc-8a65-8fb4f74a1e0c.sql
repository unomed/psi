-- Fix final Function Search Path Mutable security issues and move pg_net extension
-- Setting search_path = 'public' for remaining vulnerable functions and securing extensions

-- Fix remaining function security issues
DO $$
BEGIN
    -- Try to set search_path for functions that might exist with different signatures
    BEGIN
        ALTER FUNCTION public.calculate_psychosocial_metrics(uuid) SET search_path = 'public';
    EXCEPTION WHEN undefined_function THEN
        BEGIN
            ALTER FUNCTION public.calculate_psychosocial_metrics(uuid, date, date) SET search_path = 'public';
        EXCEPTION WHEN undefined_function THEN
            NULL; -- Function doesn't exist, skip
        END;
    END;
    
    BEGIN
        ALTER FUNCTION public.get_dashboard_analytics(uuid) SET search_path = 'public';
    EXCEPTION WHEN undefined_function THEN
        NULL; -- Function doesn't exist, skip
    END;
END $$;

-- Move pg_net extension from public schema to extensions schema for security
-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_net extension to extensions schema
DO $$
BEGIN
    -- Check if pg_net exists in public schema and move it
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        -- Drop from public and recreate in extensions schema
        DROP EXTENSION IF EXISTS pg_net CASCADE;
        CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;
    END IF;
END $$;