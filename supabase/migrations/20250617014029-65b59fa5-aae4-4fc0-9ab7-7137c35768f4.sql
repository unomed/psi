
-- Add missing columns to scheduled_assessments table
ALTER TABLE scheduled_assessments 
ADD COLUMN IF NOT EXISTS portal_token TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled',
ADD COLUMN IF NOT EXISTS employee_name TEXT,
ADD COLUMN IF NOT EXISTS template_id UUID,
ADD COLUMN IF NOT EXISTS link_url TEXT,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS employee_data JSONB DEFAULT '{}';

-- Add index for portal_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_scheduled_assessments_portal_token ON scheduled_assessments(portal_token);

-- Add index for status for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_scheduled_assessments_status ON scheduled_assessments(status);
