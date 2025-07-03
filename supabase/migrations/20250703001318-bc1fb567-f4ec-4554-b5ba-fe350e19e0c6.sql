-- Add foreign key constraint between audit_logs and profiles
ALTER TABLE audit_logs 
ADD CONSTRAINT audit_logs_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Add foreign key constraint between audit_logs and companies  
ALTER TABLE audit_logs 
ADD CONSTRAINT audit_logs_company_id_fkey 
FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;