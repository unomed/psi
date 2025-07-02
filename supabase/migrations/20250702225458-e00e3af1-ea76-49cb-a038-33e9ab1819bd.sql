-- Enable RLS on company_notifications table
ALTER TABLE public.company_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for company_notifications
CREATE POLICY "Users can view company notifications for their companies"
ON public.company_notifications
FOR SELECT
USING (user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "Users can insert company notifications for their companies"
ON public.company_notifications
FOR INSERT
WITH CHECK (user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "Users can update company notifications for their companies"
ON public.company_notifications
FOR UPDATE
USING (user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "Users can delete company notifications for their companies"
ON public.company_notifications
FOR DELETE
USING (user_has_company_access(company_id) OR is_superadmin());

-- Create notification_emails table if it doesn't exist and enable RLS
CREATE TABLE IF NOT EXISTS public.notification_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  delivery_status TEXT DEFAULT 'sent',
  assessment_response_id UUID,
  risk_analysis_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on notification_emails table
ALTER TABLE public.notification_emails ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notification_emails
CREATE POLICY "Users can view notification emails for their companies"
ON public.notification_emails
FOR SELECT
USING (user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "Users can insert notification emails for their companies"
ON public.notification_emails
FOR INSERT
WITH CHECK (user_has_company_access(company_id) OR is_superadmin());

CREATE POLICY "Users can update notification emails for their companies"
ON public.notification_emails
FOR UPDATE
USING (user_has_company_access(company_id) OR is_superadmin());

-- Only superadmins can delete notification emails (audit trail)
CREATE POLICY "Only superadmins can delete notification emails"
ON public.notification_emails
FOR DELETE
USING (is_superadmin());