-- Fix security issue: Set empty search_path for get_dashboard_analytics function
CREATE OR REPLACE FUNCTION public.get_dashboard_analytics()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    result jsonb;
BEGIN
    -- Basic dashboard analytics with secure empty search_path
    -- All table references must be fully qualified with schema
    result := jsonb_build_object(
        'total_companies', (SELECT COUNT(*) FROM public.companies),
        'total_employees', (SELECT COUNT(*) FROM public.employees),
        'total_assessments', (SELECT COUNT(*) FROM public.assessment_responses),
        'timestamp', now()
    );
    
    RETURN result;
END;
$function$;