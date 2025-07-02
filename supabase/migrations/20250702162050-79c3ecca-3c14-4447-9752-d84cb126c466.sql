-- Adicionar constraint única para company_id na tabela psychosocial_background_settings
-- Isso permite usar ON CONFLICT na operação upsert

ALTER TABLE psychosocial_background_settings 
ADD CONSTRAINT unique_company_id_background_settings UNIQUE (company_id);

-- Como pode haver apenas uma configuração global (company_id = NULL),
-- precisamos tratar esse caso especial criando um índice único parcial
DROP CONSTRAINT IF EXISTS unique_company_id_background_settings;

-- Criar índice único que permite múltiplos NULLs mas garante que company_id únicos
CREATE UNIQUE INDEX unique_company_background_settings 
ON psychosocial_background_settings (company_id) 
WHERE company_id IS NOT NULL;

-- Para o caso global (company_id = NULL), criar constraint que permite apenas um registro
CREATE UNIQUE INDEX unique_global_background_settings 
ON psychosocial_background_settings ((1)) 
WHERE company_id IS NULL;