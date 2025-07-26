-- Fix search_path security issues by dropping and recreating functions with secure empty search_path

-- First drop the problematic functions
DROP FUNCTION IF EXISTS public.associate_user_with_company(uuid, uuid);
DROP FUNCTION IF EXISTS public.check_company_access(uuid);
DROP FUNCTION IF EXISTS public.get_user_emails(uuid);

-- Also check for any get_dashboard_analytics variants
DO $$
DECLARE
    func_rec RECORD;
BEGIN
    FOR func_rec IN 
        SELECT p.oid, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname = 'get_dashboard_analytics'
        AND (p.proconfig IS NULL OR NOT ('search_path=' = ANY(p.proconfig)))
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || func_rec.proname || '(' || func_rec.args || ')';
    END LOOP;
END $$;

-- Recreate functions with secure empty search_path
CREATE OR REPLACE FUNCTION public.associate_user_with_company(p_user_id uuid, p_company_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.user_companies (user_id, company_id)
    VALUES (p_user_id, p_company_id)
    ON CONFLICT DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_company_access(p_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_companies 
        WHERE user_id = auth.uid() 
        AND company_id = p_company_id
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_emails(p_user_id uuid)
RETURNS TABLE(email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT auth.users.email::text
    FROM auth.users
    WHERE auth.users.id = p_user_id;
END;
$$;