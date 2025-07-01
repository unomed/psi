
-- Primeiro, adicionar uma constraint única na tabela user_companies se ela não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_companies_unique_user_company'
  ) THEN
    ALTER TABLE user_companies ADD CONSTRAINT user_companies_unique_user_company 
    UNIQUE (user_id, company_id);
  END IF;
END $$;

-- Adicionar constraint única em user_roles se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_roles_user_id_unique'
  ) THEN
    ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_unique 
    UNIQUE (user_id);
  END IF;
END $$;

-- Agora associar o usuário gerencia@unomed.med.br às empresas existentes
INSERT INTO user_companies (user_id, company_id)
SELECT 'ba23ac5e-a55c-465d-892c-34839d8cf73c'::uuid, id::text
FROM companies
ON CONFLICT (user_id, company_id) DO NOTHING;

-- Verificar se o usuário tem uma role definida, se não tiver, definir como admin
INSERT INTO user_roles (user_id, role)
VALUES ('ba23ac5e-a55c-465d-892c-34839d8cf73c'::uuid, 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
