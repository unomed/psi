
-- Fase 1: Criar modelo relacional para tags de funcionários

-- 1. Tabela de tipos de tags (catálogo de tags disponíveis)
CREATE TABLE public.employee_tag_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT, -- Ex: 'certification', 'skill', 'training'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Tabela de associação funcionário-tag (many-to-many)
CREATE TABLE public.employee_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  tag_type_id UUID NOT NULL REFERENCES public.employee_tag_types(id) ON DELETE CASCADE,
  acquired_date DATE,
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, tag_type_id)
);

-- 3. Tabela de tags obrigatórias por função (substitui required_tags JSONB)
CREATE TABLE public.role_required_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  tag_type_id UUID NOT NULL REFERENCES public.employee_tag_types(id) ON DELETE CASCADE,
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role_id, tag_type_id)
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.employee_tag_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_required_tags ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (usuários autenticados podem ver/gerenciar)
CREATE POLICY "Users can view tag types" ON public.employee_tag_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage tag types" ON public.employee_tag_types FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view employee tags" ON public.employee_tags FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.employees e 
    WHERE e.id = employee_id 
    AND public.user_has_company_access(e.company_id, auth.uid())
  )
);

CREATE POLICY "Users can manage employee tags" ON public.employee_tags FOR ALL TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.employees e 
    WHERE e.id = employee_id 
    AND public.user_has_company_access(e.company_id, auth.uid())
  )
);

CREATE POLICY "Users can view role required tags" ON public.role_required_tags FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.roles r 
    WHERE r.id = role_id 
    AND public.user_has_company_access(r.company_id, auth.uid())
  )
);

CREATE POLICY "Users can manage role required tags" ON public.role_required_tags FOR ALL TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.roles r 
    WHERE r.id = role_id 
    AND public.user_has_company_access(r.company_id, auth.uid())
  )
);

-- Índices para performance
CREATE INDEX idx_employee_tags_employee_id ON public.employee_tags(employee_id);
CREATE INDEX idx_employee_tags_tag_type_id ON public.employee_tags(tag_type_id);
CREATE INDEX idx_role_required_tags_role_id ON public.role_required_tags(role_id);
CREATE INDEX idx_role_required_tags_tag_type_id ON public.role_required_tags(tag_type_id);
CREATE INDEX idx_employee_tag_types_name ON public.employee_tag_types(name);
CREATE INDEX idx_employee_tag_types_category ON public.employee_tag_types(category);

-- Trigger para updated_at
CREATE TRIGGER update_employee_tag_types_updated_at
  BEFORE UPDATE ON public.employee_tag_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employee_tags_updated_at
  BEFORE UPDATE ON public.employee_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Popular tabela com tags comuns
INSERT INTO public.employee_tag_types (name, description, category) VALUES
('CNH Categoria A', 'Carteira Nacional de Habilitação - Categoria A', 'certification'),
('CNH Categoria B', 'Carteira Nacional de Habilitação - Categoria B', 'certification'),
('CNH Categoria C', 'Carteira Nacional de Habilitação - Categoria C', 'certification'),
('CNH Categoria D', 'Carteira Nacional de Habilitação - Categoria D', 'certification'),
('CNH Categoria E', 'Carteira Nacional de Habilitação - Categoria E', 'certification'),
('Curso NR10', 'Norma Regulamentadora 10 - Segurança em Instalações e Serviços em Eletricidade', 'training'),
('Curso NR35', 'Norma Regulamentadora 35 - Trabalho em Altura', 'training'),
('Inglês Básico', 'Conhecimento básico em inglês', 'skill'),
('Inglês Intermediário', 'Conhecimento intermediário em inglês', 'skill'),
('Inglês Avançado', 'Conhecimento avançado em inglês', 'skill'),
('Excel Básico', 'Conhecimento básico em Microsoft Excel', 'skill'),
('Excel Avançado', 'Conhecimento avançado em Microsoft Excel', 'skill'),
('Liderança', 'Competência em liderança de equipes', 'skill'),
('Comunicação', 'Habilidades de comunicação efetiva', 'skill'),
('Primeiros Socorros', 'Treinamento em primeiros socorros', 'training');

-- Função para migrar dados JSONB existentes
CREATE OR REPLACE FUNCTION public.migrate_employee_tags_from_jsonb()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  emp_record RECORD;
  tag_name TEXT;
  tag_type_id UUID;
BEGIN
  -- Migrar tags dos funcionários
  FOR emp_record IN 
    SELECT id, employee_tags 
    FROM employees 
    WHERE employee_tags IS NOT NULL 
    AND jsonb_array_length(employee_tags) > 0
  LOOP
    -- Para cada tag no array JSONB
    FOR tag_name IN 
      SELECT jsonb_array_elements_text(emp_record.employee_tags)
    LOOP
      -- Buscar ou criar o tipo de tag
      SELECT id INTO tag_type_id 
      FROM employee_tag_types 
      WHERE name = tag_name;
      
      -- Se não existir, criar
      IF tag_type_id IS NULL THEN
        INSERT INTO employee_tag_types (name, category) 
        VALUES (tag_name, 'skill') 
        RETURNING id INTO tag_type_id;
      END IF;
      
      -- Inserir associação funcionário-tag
      INSERT INTO employee_tags (employee_id, tag_type_id)
      VALUES (emp_record.id, tag_type_id)
      ON CONFLICT (employee_id, tag_type_id) DO NOTHING;
    END LOOP;
  END LOOP;
  
  -- Migrar tags obrigatórias das funções
  FOR emp_record IN 
    SELECT id, required_tags 
    FROM roles 
    WHERE required_tags IS NOT NULL 
    AND jsonb_array_length(required_tags) > 0
  LOOP
    -- Para cada tag obrigatória
    FOR tag_name IN 
      SELECT jsonb_array_elements_text(emp_record.required_tags)
    LOOP
      -- Buscar ou criar o tipo de tag
      SELECT id INTO tag_type_id 
      FROM employee_tag_types 
      WHERE name = tag_name;
      
      -- Se não existir, criar
      IF tag_type_id IS NULL THEN
        INSERT INTO employee_tag_types (name, category) 
        VALUES (tag_name, 'requirement') 
        RETURNING id INTO tag_type_id;
      END IF;
      
      -- Inserir como tag obrigatória da função
      INSERT INTO role_required_tags (role_id, tag_type_id)
      VALUES (emp_record.id, tag_type_id)
      ON CONFLICT (role_id, tag_type_id) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;

-- Função para obter tags de um funcionário (substitui acesso direto ao JSONB)
CREATE OR REPLACE FUNCTION public.get_employee_tags(p_employee_id UUID)
RETURNS TABLE(
  tag_id UUID,
  tag_name TEXT,
  tag_description TEXT,
  tag_category TEXT,
  acquired_date DATE,
  expiry_date DATE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ett.id,
    ett.name,
    ett.description,
    ett.category,
    et.acquired_date,
    et.expiry_date
  FROM employee_tags et
  JOIN employee_tag_types ett ON et.tag_type_id = ett.id
  WHERE et.employee_id = p_employee_id
  AND ett.is_active = true
  ORDER BY ett.name;
END;
$$;

-- Função para obter tags obrigatórias de uma função
CREATE OR REPLACE FUNCTION public.get_role_required_tags(p_role_id UUID)
RETURNS TABLE(
  tag_id UUID,
  tag_name TEXT,
  tag_description TEXT,
  is_mandatory BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ett.id,
    ett.name,
    ett.description,
    rrt.is_mandatory
  FROM role_required_tags rrt
  JOIN employee_tag_types ett ON rrt.tag_type_id = ett.id
  WHERE rrt.role_id = p_role_id
  AND ett.is_active = true
  ORDER BY ett.name;
END;
$$;

-- Atualizar trigger de validação para usar nova estrutura
CREATE OR REPLACE FUNCTION public.validate_employee_required_tags_relational()
RETURNS TRIGGER AS $$
DECLARE
    missing_tags TEXT[];
    required_tag_names TEXT[];
    employee_tag_names TEXT[];
BEGIN
    -- Só validar para funcionários, não para candidatos
    IF NEW.employee_type = 'funcionario' THEN
        -- Buscar nomes das tags obrigatórias da função
        SELECT array_agg(ett.name) INTO required_tag_names
        FROM role_required_tags rrt
        JOIN employee_tag_types ett ON rrt.tag_type_id = ett.id
        WHERE rrt.role_id = NEW.role_id
        AND rrt.is_mandatory = true
        AND ett.is_active = true;
        
        -- Se há tags obrigatórias
        IF required_tag_names IS NOT NULL AND array_length(required_tag_names, 1) > 0 THEN
            -- Buscar tags que o funcionário possui
            SELECT array_agg(ett.name) INTO employee_tag_names
            FROM employee_tags et
            JOIN employee_tag_types ett ON et.tag_type_id = ett.id
            WHERE et.employee_id = NEW.id
            AND ett.is_active = true;
            
            -- Encontrar tags em falta
            SELECT array_agg(tag) INTO missing_tags
            FROM unnest(required_tag_names) AS tag
            WHERE NOT (tag = ANY(COALESCE(employee_tag_names, ARRAY[]::TEXT[])));
            
            -- Se há tags em falta, gerar erro
            IF missing_tags IS NOT NULL AND array_length(missing_tags, 1) > 0 THEN
                RAISE EXCEPTION 'Funcionário não possui as seguintes tags obrigatórias para esta função: %', array_to_string(missing_tags, ', ');
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Substituir trigger antigo
DROP TRIGGER IF EXISTS validate_employee_tags_trigger ON employees;
CREATE TRIGGER validate_employee_tags_relational_trigger
    BEFORE INSERT OR UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION validate_employee_required_tags_relational();

-- Comentários para documentação
COMMENT ON TABLE employee_tag_types IS 'Catálogo de tipos de tags/competências disponíveis';
COMMENT ON TABLE employee_tags IS 'Associação many-to-many entre funcionários e tags';
COMMENT ON TABLE role_required_tags IS 'Tags obrigatórias por função (substitui required_tags JSONB)';
