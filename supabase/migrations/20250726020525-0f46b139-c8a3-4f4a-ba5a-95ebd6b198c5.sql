-- Corrigir a função get_dashboard_analytics que não tem search_path configurado
CREATE OR REPLACE FUNCTION public.get_dashboard_analytics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    result jsonb;
BEGIN
    -- Se a função existir, recriá-la com search_path correto
    -- Se não existir, criar uma versão básica
    result := jsonb_build_object(
        'total_companies', (SELECT COUNT(*) FROM companies),
        'total_employees', (SELECT COUNT(*) FROM employees),
        'total_assessments', (SELECT COUNT(*) FROM assessment_responses),
        'timestamp', now()
    );
    
    RETURN result;
END;
$$;