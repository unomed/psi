-- Fix get_dashboard_analytics function with secure search_path

-- First, drop any existing versions of get_dashboard_analytics with insecure search_path
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

-- Create secure get_dashboard_analytics function
CREATE OR REPLACE FUNCTION public.get_dashboard_analytics(p_company_id uuid DEFAULT NULL, p_period_days integer DEFAULT 30)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    result jsonb;
    total_employees integer;
    total_assessments integer;
    total_action_plans integer;
    pending_assessments integer;
    company_filter uuid;
BEGIN
    -- If no company specified, use first accessible company for non-superadmins
    IF p_company_id IS NULL THEN
        -- For superadmins, we'll aggregate across all companies they can see
        -- For regular users, use their first accessible company
        IF NOT public.is_superadmin() THEN
            SELECT (public.user_companies.company_id)::uuid INTO company_filter
            FROM public.user_companies 
            WHERE public.user_companies.user_id = auth.uid() 
            LIMIT 1;
            
            IF company_filter IS NULL THEN
                RETURN '{"error": "No accessible company found"}'::jsonb;
            END IF;
        END IF;
    ELSE
        company_filter := p_company_id;
        
        -- Verify access to specified company
        IF NOT public.is_superadmin() AND NOT public.user_has_company_access(company_filter) THEN
            RETURN '{"error": "Access denied to specified company"}'::jsonb;
        END IF;
    END IF;

    -- Get total employees
    SELECT COUNT(*) INTO total_employees
    FROM public.employees e
    WHERE (company_filter IS NULL OR e.company_id = company_filter)
    AND e.created_at >= (CURRENT_DATE - p_period_days * INTERVAL '1 day');

    -- Get total assessments
    SELECT COUNT(*) INTO total_assessments
    FROM public.assessment_responses ar
    JOIN public.employees e ON e.id = ar.employee_id
    WHERE (company_filter IS NULL OR e.company_id = company_filter)
    AND ar.completed_at >= (CURRENT_DATE - p_period_days * INTERVAL '1 day');

    -- Get total action plans
    SELECT COUNT(*) INTO total_action_plans
    FROM public.action_plans ap
    WHERE (company_filter IS NULL OR ap.company_id = company_filter)
    AND ap.created_at >= (CURRENT_DATE - p_period_days * INTERVAL '1 day');

    -- Get pending assessments (this is a simple count, you might want to adjust based on your business logic)
    SELECT COUNT(*) INTO pending_assessments
    FROM public.employees e
    LEFT JOIN public.assessment_responses ar ON e.id = ar.employee_id 
        AND ar.completed_at >= (CURRENT_DATE - p_period_days * INTERVAL '1 day')
    WHERE (company_filter IS NULL OR e.company_id = company_filter)
    AND ar.id IS NULL;

    -- Build result
    result := jsonb_build_object(
        'total_employees', total_employees,
        'total_assessments', total_assessments,
        'total_action_plans', total_action_plans,
        'pending_assessments', pending_assessments,
        'period_days', p_period_days,
        'company_id', company_filter
    );

    RETURN result;
END;
$$;