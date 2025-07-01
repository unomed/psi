
-- Primeiro, verificar se há respostas de avaliação usando este template
SELECT COUNT(*) as total_responses 
FROM assessment_responses 
WHERE template_id = 'b8eded86-81ca-4ba5-b88c-ca53fdb83cc4';

-- Se não houver respostas, proceder com a remoção
-- Remover perguntas associadas ao template específico
DELETE FROM questions 
WHERE template_id = 'b8eded86-81ca-4ba5-b88c-ca53fdb83cc4';

-- Remover o template específico "Avaliação de Riscos Psicossociais - MTE"
DELETE FROM checklist_templates 
WHERE id = 'b8eded86-81ca-4ba5-b88c-ca53fdb83cc4' 
AND title = 'Avaliação de Riscos Psicossociais - MTE';

-- Verificar que o template correto foi removido e o outro permanece
SELECT id, title, type 
FROM checklist_templates 
WHERE title LIKE '%MTE%' 
ORDER BY title;
