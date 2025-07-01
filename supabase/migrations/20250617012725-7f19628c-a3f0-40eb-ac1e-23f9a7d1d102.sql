
-- Add missing enum values to checklist_type
ALTER TYPE checklist_type ADD VALUE IF NOT EXISTS 'psicossocial';
ALTER TYPE checklist_type ADD VALUE IF NOT EXISTS 'personal_life';
ALTER TYPE checklist_type ADD VALUE IF NOT EXISTS 'evaluation_360';
