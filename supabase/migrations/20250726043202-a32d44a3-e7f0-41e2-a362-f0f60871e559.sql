-- Remove the problematic get_dashboard_analytics function without search_path
-- The secure version with search_path = '' is already in place
DROP FUNCTION IF EXISTS public.get_dashboard_analytics(uuid, integer);
DROP FUNCTION IF EXISTS public.get_dashboard_analytics(text, integer);
DROP FUNCTION IF EXISTS public.get_dashboard_analytics(uuid);

-- Also fix other functions that don't have empty search_path
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