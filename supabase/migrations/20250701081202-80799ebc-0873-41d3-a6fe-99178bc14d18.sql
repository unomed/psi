
-- Buscar o ID do template "Avaliação Psicossocial - MTE Completa"
DO $$
DECLARE
    template_uuid UUID;
BEGIN
    -- Buscar o template correto
    SELECT id INTO template_uuid 
    FROM checklist_templates 
    WHERE title = 'Avaliação Psicossocial - MTE Completa' 
    AND type = 'psicossocial';
    
    -- Se encontrado, remover perguntas antigas e adicionar as novas
    IF template_uuid IS NOT NULL THEN
        -- Remover perguntas antigas
        DELETE FROM questions WHERE template_id = template_uuid;
        
        -- CATEGORIA 1: DEMANDAS DE TRABALHO (5 perguntas)
        INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
        (template_uuid, 'Tenho que trabalhar muito rapidamente para cumprir prazos', 1, 'demandas_trabalho', 1.0),
        (template_uuid, 'Meu trabalho exige muito esforço físico e mental', 2, 'demandas_trabalho', 1.0),
        (template_uuid, 'Preciso trabalhar intensamente por longos períodos', 3, 'demandas_trabalho', 1.0),
        (template_uuid, 'Tenho quantidade excessiva de trabalho para fazer', 4, 'demandas_trabalho', 1.0),
        (template_uuid, 'As demandas do meu trabalho são conflitantes entre si', 5, 'demandas_trabalho', 1.0);
        
        -- CATEGORIA 2: CONTROLE E AUTONOMIA (5 perguntas)
        INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
        (template_uuid, 'Posso decidir como realizar minhas tarefas', 6, 'controle_autonomia', 1.0),
        (template_uuid, 'Tenho influência sobre as decisões que afetam meu trabalho', 7, 'controle_autonomia', 1.0),
        (template_uuid, 'Posso controlar o ritmo e a velocidade do meu trabalho', 8, 'controle_autonomia', 1.0),
        (template_uuid, 'Tenho liberdade para organizar meu tempo de trabalho', 9, 'controle_autonomia', 1.0),
        (template_uuid, 'Posso usar minhas habilidades e conhecimentos no trabalho', 10, 'controle_autonomia', 1.0);
        
        -- CATEGORIA 3: CONDIÇÕES AMBIENTAIS (5 perguntas)
        INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
        (template_uuid, 'O ambiente físico do meu trabalho é adequado (temperatura, ventilação, iluminação)', 11, 'condicoes_ambientais', 1.0),
        (template_uuid, 'Tenho equipamentos e ferramentas adequados para realizar meu trabalho', 12, 'condicoes_ambientais', 1.0),
        (template_uuid, 'O nível de ruído no meu ambiente de trabalho é aceitável', 13, 'condicoes_ambientais', 1.0),
        (template_uuid, 'Meu posto de trabalho é ergonomicamente adequado', 14, 'condicoes_ambientais', 1.0),
        (template_uuid, 'Tenho acesso aos recursos necessários para fazer meu trabalho', 15, 'condicoes_ambientais', 1.0);
        
        -- CATEGORIA 4: RELAÇÕES SOCIOPROFISSIONAIS (5 perguntas)
        INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
        (template_uuid, 'A comunicação entre colegas e superiores é clara e eficaz', 16, 'relacoes_socioprofissionais', 1.0),
        (template_uuid, 'Recebo liderança adequada dos meus superiores', 17, 'relacoes_socioprofissionais', 1.0),
        (template_uuid, 'Existe cooperação e trabalho em equipe no meu setor', 18, 'relacoes_socioprofissionais', 1.0),
        (template_uuid, 'Conflitos interpessoais são resolvidos de forma adequada', 19, 'relacoes_socioprofissionais', 1.0),
        (template_uuid, 'Sinto-me respeitado pelos colegas e superiores', 20, 'relacoes_socioprofissionais', 1.0);
        
        -- CATEGORIA 5: RECONHECIMENTO E CRESCIMENTO (5 perguntas)
        INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
        (template_uuid, 'Recebo reconhecimento pelo meu trabalho e esforços', 21, 'reconhecimento_crescimento', 1.0),
        (template_uuid, 'Tenho oportunidades de desenvolvimento profissional', 22, 'reconhecimento_crescimento', 1.0),
        (template_uuid, 'Recebo feedback regular sobre meu desempenho', 23, 'reconhecimento_crescimento', 1.0),
        (template_uuid, 'Vejo possibilidades de crescimento na carreira', 24, 'reconhecimento_crescimento', 1.0),
        (template_uuid, 'Meu trabalho é valorizado pela organização', 25, 'reconhecimento_crescimento', 1.0);
        
        -- CATEGORIA 6: ELO TRABALHO-VIDA SOCIAL (4 perguntas)
        INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
        (template_uuid, 'Consigo equilibrar trabalho e vida pessoal', 26, 'elo_trabalho_vida_social', 1.0),
        (template_uuid, 'Os horários de trabalho interferem na minha vida familiar', 27, 'elo_trabalho_vida_social', 1.0),
        (template_uuid, 'Tenho flexibilidade de horários quando necessário', 28, 'elo_trabalho_vida_social', 1.0),
        (template_uuid, 'O trabalho me permite tempo para atividades pessoais', 29, 'elo_trabalho_vida_social', 1.0);
        
        -- CATEGORIA 7: SUPORTE SOCIAL (4 perguntas)
        INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
        (template_uuid, 'Recebo apoio dos colegas quando preciso', 30, 'suporte_social', 1.0),
        (template_uuid, 'Meu supervisor me oferece suporte quando necessário', 31, 'suporte_social', 1.0),
        (template_uuid, 'Posso contar com ajuda da equipe em situações difíceis', 32, 'suporte_social', 1.0),
        (template_uuid, 'Sinto-me parte de um grupo de trabalho unido', 33, 'suporte_social', 1.0);
        
        -- CATEGORIA 8: CLAREZA DE PAPEL (4 perguntas)
        INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
        (template_uuid, 'Sei exatamente o que é esperado de mim no trabalho', 34, 'clareza_papel', 1.0),
        (template_uuid, 'Tenho objetivos claros e bem definidos', 35, 'clareza_papel', 1.0),
        (template_uuid, 'Minhas responsabilidades são bem delimitadas', 36, 'clareza_papel', 1.0),
        (template_uuid, 'Recebo informações claras sobre procedimentos de trabalho', 37, 'clareza_papel', 1.0);
        
        -- CATEGORIA 9: RECONHECIMENTO E RECOMPENSAS (4 perguntas)
        INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
        (template_uuid, 'A remuneração é adequada ao trabalho que realizo', 38, 'reconhecimento_recompensas', 1.0),
        (template_uuid, 'Existem sistemas justos de avaliação de desempenho', 39, 'reconhecimento_recompensas', 1.0),
        (template_uuid, 'Recebo benefícios adequados da empresa', 40, 'reconhecimento_recompensas', 1.0),
        (template_uuid, 'Há equidade no tratamento entre os funcionários', 41, 'reconhecimento_recompensas', 1.0);
        
        -- CATEGORIA 10: GESTÃO DE MUDANÇAS (3 perguntas)
        INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
        (template_uuid, 'Sou informado adequadamente sobre mudanças na empresa', 42, 'gestao_mudancas', 1.0),
        (template_uuid, 'Tenho participação nas decisões que afetam meu trabalho', 43, 'gestao_mudancas', 1.0),
        (template_uuid, 'Mudanças organizacionais são implementadas de forma adequada', 44, 'gestao_mudancas', 1.0);
        
        -- CATEGORIA 11: IMPACTOS NA SAÚDE (5 perguntas)
        INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
        (template_uuid, 'O trabalho causa fadiga excessiva', 45, 'impactos_saude', 1.0),
        (template_uuid, 'Sinto sintomas de estresse relacionados ao trabalho', 46, 'impactos_saude', 1.0),
        (template_uuid, 'Tenho problemas de sono relacionados ao trabalho', 47, 'impactos_saude', 1.0),
        (template_uuid, 'O trabalho afeta meu bem-estar emocional', 48, 'impactos_saude', 1.0),
        (template_uuid, 'Sinto sintomas físicos relacionados ao trabalho (dores, tensão)', 49, 'impactos_saude', 1.0);
        
        -- Atualizar o template com nova estimativa de tempo
        UPDATE checklist_templates 
        SET estimated_time_minutes = 20,
            updated_at = now()
        WHERE id = template_uuid;
        
        RAISE NOTICE 'Template "Avaliação Psicossocial - MTE Completa" expandido com sucesso! 49 perguntas adicionadas.';
    ELSE
        RAISE NOTICE 'Template "Avaliação Psicossocial - MTE Completa" não encontrado.';
    END IF;
END $$;

-- Verificar se as perguntas foram adicionadas corretamente
SELECT 
    ct.title,
    COUNT(q.id) as total_perguntas,
    ct.estimated_time_minutes
FROM checklist_templates ct
LEFT JOIN questions q ON ct.id = q.template_id
WHERE ct.title = 'Avaliação Psicossocial - MTE Completa'
GROUP BY ct.id, ct.title, ct.estimated_time_minutes;

-- Verificar distribuição por categoria
SELECT 
    q.target_factor as categoria,
    COUNT(*) as quantidade_perguntas
FROM checklist_templates ct
JOIN questions q ON ct.id = q.template_id
WHERE ct.title = 'Avaliação Psicossocial - MTE Completa'
GROUP BY q.target_factor
ORDER BY q.target_factor;
