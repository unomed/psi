
-- Adicionar colunas para tipo de funcionário e tags na tabela employees
ALTER TABLE employees 
ADD COLUMN employee_type text NOT NULL DEFAULT 'funcionario' CHECK (employee_type IN ('funcionario', 'candidato')),
ADD COLUMN employee_tags jsonb DEFAULT '[]'::jsonb;

-- Adicionar coluna para tags obrigatórias na tabela roles
ALTER TABLE roles 
ADD COLUMN required_tags jsonb DEFAULT '[]'::jsonb;

-- Corrigir relacionamento entre roles e sectors (se não existir foreign key)
-- Verificar se já existe a relação - se não, adicionar constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'roles_sector_id_fkey' 
        AND table_name = 'roles'
    ) THEN
        ALTER TABLE roles 
        ADD CONSTRAINT roles_sector_id_fkey 
        FOREIGN KEY (sector_id) REFERENCES sectors(id);
    END IF;
END $$;

-- Criar função para validar tags obrigatórias
CREATE OR REPLACE FUNCTION validate_employee_required_tags()
RETURNS TRIGGER AS $$
DECLARE
    role_required_tags jsonb;
    missing_tags jsonb;
BEGIN
    -- Só validar para funcionários, não para candidatos
    IF NEW.employee_type = 'funcionario' THEN
        -- Buscar tags obrigatórias da função
        SELECT required_tags INTO role_required_tags
        FROM roles 
        WHERE id = NEW.role_id;
        
        -- Se há tags obrigatórias, verificar se o funcionário as possui
        IF role_required_tags IS NOT NULL AND jsonb_array_length(role_required_tags) > 0 THEN
            -- Encontrar tags em falta
            SELECT jsonb_agg(tag) INTO missing_tags
            FROM jsonb_array_elements_text(role_required_tags) AS tag
            WHERE NOT (NEW.employee_tags ? tag);
            
            -- Se há tags em falta, gerar erro
            IF missing_tags IS NOT NULL AND jsonb_array_length(missing_tags) > 0 THEN
                RAISE EXCEPTION 'Funcionário não possui as seguintes tags obrigatórias para esta função: %', missing_tags::text;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para validação de tags
DROP TRIGGER IF EXISTS validate_employee_tags_trigger ON employees;
CREATE TRIGGER validate_employee_tags_trigger
    BEFORE INSERT OR UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION validate_employee_required_tags();

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_employees_type ON employees(employee_type);
CREATE INDEX IF NOT EXISTS idx_employees_tags ON employees USING gin(employee_tags);
CREATE INDEX IF NOT EXISTS idx_roles_required_tags ON roles USING gin(required_tags);
CREATE INDEX IF NOT EXISTS idx_roles_sector_id ON roles(sector_id);

-- Comentários para documentação
COMMENT ON COLUMN employees.employee_type IS 'Tipo: funcionario (participa dos cálculos psicossociais) ou candidato (apenas entrevistas)';
COMMENT ON COLUMN employees.employee_tags IS 'Array JSON com as tags/competências do funcionário';
COMMENT ON COLUMN roles.required_tags IS 'Array JSON com as tags obrigatórias para esta função';
