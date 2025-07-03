-- Fix remaining Function Search Path Mutable security issues
-- Setting search_path = 'public' for existing vulnerable functions

-- Functions that definitely exist based on the error reports
ALTER FUNCTION public.process_psychosocial_assessment_with_notifications(uuid) SET search_path = 'public';
ALTER FUNCTION public.populate_processing_jobs() SET search_path = 'public';
ALTER FUNCTION public.update_assessment_criteria_updated_at() SET search_path = 'public';
ALTER FUNCTION public.test_assessment_processing(uuid) SET search_path = 'public';
ALTER FUNCTION public.trigger_psychosocial_auto_processing() SET search_path = 'public';
ALTER FUNCTION public.process_psychosocial_assessment_auto(uuid) SET search_path = 'public';