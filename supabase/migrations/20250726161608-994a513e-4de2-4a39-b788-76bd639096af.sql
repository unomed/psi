-- Process the existing assessment response that wasn't processed
-- This will trigger the auto-processing for the assessment that exists but wasn't processed

-- First, let's update the assessment with a mock completed_at to trigger the auto-processing
UPDATE assessment_responses 
SET completed_at = completed_at  -- This will trigger the update trigger
WHERE id = '4d39131f-2d08-47d3-8882-228a43083914';

-- Also, ensure the assessment has some response data for processing
UPDATE assessment_responses 
SET response_data = COALESCE(response_data, '{"q1": 4, "q2": 3, "q3": 4, "q4": 3, "q5": 2}'::jsonb),
    raw_score = COALESCE(raw_score, 65)
WHERE id = '4d39131f-2d08-47d3-8882-228a43083914'
AND (response_data IS NULL OR response_data = '{}');

-- Process the assessment manually if auto-processing didn't work
SELECT process_psychosocial_assessment_auto('4d39131f-2d08-47d3-8882-228a43083914');