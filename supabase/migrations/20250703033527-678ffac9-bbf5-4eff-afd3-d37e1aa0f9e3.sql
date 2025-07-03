-- Fix Function Search Path Mutable security issues
-- Setting search_path = 'public' for all functions to prevent SQL injection vulnerabilities

ALTER FUNCTION public.process_frprt_classification(uuid) SET search_path = 'public';
ALTER FUNCTION public.trigger_frprt_processing() SET search_path = 'public';
ALTER FUNCTION public.validate_employee_required_tags() SET search_path = 'public';
ALTER FUNCTION public.calculate_company_frprt_metrics(uuid, uuid) SET search_path = 'public';
ALTER FUNCTION public.migrate_employee_tags_from_jsonb() SET search_path = 'public';
ALTER FUNCTION public.get_employee_tags(uuid) SET search_path = 'public';
ALTER FUNCTION public.get_role_required_tags(uuid) SET search_path = 'public';
ALTER FUNCTION public.validate_employee_required_tags_relational() SET search_path = 'public';
ALTER FUNCTION public.send_company_notification(uuid, text, uuid, uuid) SET search_path = 'public';
ALTER FUNCTION public.create_audit_log(audit_action_type, audit_module, text, text, text, jsonb, jsonb, uuid, jsonb) SET search_path = 'public';
ALTER FUNCTION public.trigger_frprt_processing_with_notifications() SET search_path = 'public';