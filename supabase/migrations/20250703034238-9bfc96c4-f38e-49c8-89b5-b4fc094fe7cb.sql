-- Fix remaining Function Search Path Mutable security issues
-- Setting search_path = 'public' for all remaining vulnerable functions

ALTER FUNCTION public.process_psychosocial_assessment_with_notifications(uuid) SET search_path = 'public';
ALTER FUNCTION public.populate_processing_jobs() SET search_path = 'public';
ALTER FUNCTION public.update_assessment_criteria_updated_at() SET search_path = 'public';
ALTER FUNCTION public.test_assessment_processing(uuid) SET search_path = 'public';
ALTER FUNCTION public.trigger_psychosocial_auto_processing() SET search_path = 'public';
ALTER FUNCTION public.process_psychosocial_assessment_auto(uuid) SET search_path = 'public';
ALTER FUNCTION public.update_dashboard_timestamp() SET search_path = 'public';
ALTER FUNCTION public.calculate_psychosocial_metrics(uuid, date, date) SET search_path = 'public';
ALTER FUNCTION public.get_dashboard_analytics(uuid) SET search_path = 'public';
ALTER FUNCTION public.calculate_psychosocial_risk(uuid, uuid) SET search_path = 'public';
ALTER FUNCTION public.get_current_employee_id() SET search_path = 'public';
ALTER FUNCTION public.set_employee_session(text) SET search_path = 'public';