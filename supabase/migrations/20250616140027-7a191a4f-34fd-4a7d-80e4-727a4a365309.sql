
-- Executar migração de dados das tags JSONB para sistema relacional
SELECT public.migrate_employee_tags_from_jsonb();

-- Verificar quantos registros foram migrados
SELECT 
  'employee_tags' as tabela,
  COUNT(*) as registros_migrados
FROM employee_tags
UNION ALL
SELECT 
  'role_required_tags' as tabela,
  COUNT(*) as registros_migrados  
FROM role_required_tags
UNION ALL
SELECT 
  'employee_tag_types' as tabela,
  COUNT(*) as tipos_criados
FROM employee_tag_types;

-- Verificar se há funcionários com tags JSONB que precisam ser migradas
SELECT 
  COUNT(*) as funcionarios_com_tags_jsonb,
  COUNT(CASE WHEN jsonb_array_length(employee_tags) > 0 THEN 1 END) as funcionarios_com_tags_nao_vazias
FROM employees 
WHERE employee_tags IS NOT NULL;

-- Verificar se há funções com tags obrigatórias JSONB que precisam ser migradas  
SELECT 
  COUNT(*) as funcoes_com_tags_obrigatorias,
  COUNT(CASE WHEN jsonb_array_length(required_tags) > 0 THEN 1 END) as funcoes_com_tags_nao_vazias
FROM roles 
WHERE required_tags IS NOT NULL;
