-- Primeiro, verificar se a constraint existe e removê-la se necessário
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_company_id_background_settings'
        AND table_name = 'psychosocial_background_settings'
    ) THEN
        ALTER TABLE psychosocial_background_settings 
        DROP CONSTRAINT unique_company_id_background_settings;
    END IF;
END $$;

-- Criar índice único que permite múltiplos NULLs mas garante que company_id únicos
CREATE UNIQUE INDEX IF NOT EXISTS unique_company_background_settings 
ON psychosocial_background_settings (company_id) 
WHERE company_id IS NOT NULL;

-- Para o caso global (company_id = NULL), criar constraint que permite apenas um registro
CREATE UNIQUE INDEX IF NOT EXISTS unique_global_background_settings 
ON psychosocial_background_settings ((1)) 
WHERE company_id IS NULL;