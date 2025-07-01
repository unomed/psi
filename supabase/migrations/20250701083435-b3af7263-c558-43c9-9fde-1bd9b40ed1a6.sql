
-- ETAPA 1 e 2: Criar template base e migrar perguntas corretivamente (CORRIGIDO)
-- Primeiro, verificar se já existe um template com este título
DO $$
DECLARE
    existing_template_id UUID;
BEGIN
    -- Verificar se já existe o template
    SELECT id INTO existing_template_id 
    FROM checklist_templates 
    WHERE title = 'Avaliação Psicossocial - MTE Completa';
    
    -- Se não existe, criar o template
    IF existing_template_id IS NULL THEN
        -- Criar o template base (usando 'likert5' como scale_type válido)
        INSERT INTO checklist_templates (
            title,
            description,
            type,
            scale_type,
            is_active,
            is_standard,
            company_id,
            estimated_time_minutes,
            created_at,
            updated_at
        ) VALUES (
            'Avaliação Psicossocial - MTE Completa',
            'Avaliação completa de riscos psicossociais baseada no Guia do Ministério do Trabalho e Emprego (MTE), abrangendo 11 categorias de fatores de risco conforme NR-01.',
            'psicossocial',
            'likert5',
            true,
            true,
            NULL,
            20,
            now(),
            now()
        ) RETURNING id INTO existing_template_id;
        
        RAISE NOTICE 'Template "Avaliação Psicossocial - MTE Completa" criado com ID: %', existing_template_id;
    ELSE
        RAISE NOTICE 'Template já existe com ID: %', existing_template_id;
        -- Remover perguntas antigas se existirem
        DELETE FROM questions WHERE template_id = existing_template_id;
    END IF;
    
    -- Inserir as 49 perguntas organizadas por categoria
    -- CATEGORIA 1: DEMANDAS DE TRABALHO (5 perguntas)
    INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
    (existing_template_id, 'Tenho que trabalhar muito rapidamente para cumprir prazos', 1, 'demandas_trabalho', 1.0),
    (existing_template_id, 'Meu trabalho exige muito esforço físico e mental', 2, 'demandas_trabalho', 1.0),
    (existing_template_id, 'Preciso trabalhar intensamente por longos períodos', 3, 'demandas_trabalho', 1.0),
    (existing_template_id, 'Tenho quantidade excessiva de trabalho para fazer', 4, 'demandas_trabalho', 1.0),
    (existing_template_id, 'As demandas do meu trabalho são conflitantes entre si', 5, 'demandas_trabalho', 1.0);
    
    -- CATEGORIA 2: CONTROLE E AUTONOMIA (5 perguntas)
    INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
    (existing_template_id, 'Posso decidir como realizar minhas tarefas', 6, 'controle_autonomia', 1.0),
    (existing_template_id, 'Tenho influência sobre as decisões que afetam meu trabalho', 7, 'controle_autonomia', 1.0),
    (existing_template_id, 'Posso controlar o ritmo e a velocidade do meu trabalho', 8, 'controle_autonomia', 1.0),
    (existing_template_id, 'Tenho liberdade para organizar meu tempo de trabalho', 9, 'controle_autonomia', 1.0),
    (existing_template_id, 'Posso usar minhas habilidades e conhecimentos no trabalho', 10, 'controle_autonomia', 1.0);
    
    -- CATEGORIA 3: CONDIÇÕES AMBIENTAIS (5 perguntas)
    INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
    (existing_template_id, 'O ambiente físico do meu trabalho é adequado (temperatura, ventilação, iluminação)', 11, 'condicoes_ambientais', 1.0),
    (existing_template_id, 'Tenho equipamentos e ferramentas adequados para realizar meu trabalho', 12, 'condicoes_ambientais', 1.0),
    (existing_template_id, 'O nível de ruído no meu ambiente de trabalho é aceitável', 13, 'condicoes_ambientais', 1.0),
    (existing_template_id, 'Meu posto de trabalho é ergonomicamente adequado', 14, 'condicoes_ambientais', 1.0),
    (existing_template_id, 'Tenho acesso aos recursos necessários para fazer meu trabalho', 15, 'condicoes_ambientais', 1.0);
    
    -- CATEGORIA 4: RELAÇÕES SOCIOPROFISSIONAIS (5 perguntas)
    INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
    (existing_template_id, 'A comunicação entre colegas e superiores é clara e eficaz', 16, 'relacoes_socioprofissionais', 1.0),
    (existing_template_id, 'Recebo liderança adequada dos meus superiores', 17, 'relacoes_socioprofissionais', 1.0),
    (existing_template_id, 'Existe cooperação e trabalho em equipe no meu setor', 18, 'relacoes_socioprofissionais', 1.0),
    (existing_template_id, 'Conflitos interpessoais são resolvidos de forma adequada', 19, 'relacoes_socioprofissionais', 1.0),
    (existing_template_id, 'Sinto-me respeitado pelos colegas e superiores', 20, 'relacoes_socioprofissionais', 1.0);
    
    -- CATEGORIA 5: RECONHECIMENTO E CRESCIMENTO (5 perguntas)
    INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
    (existing_template_id, 'Recebo reconhecimento pelo meu trabalho e esforços', 21, 'reconhecimento_crescimento', 1.0),
    (existing_template_id, 'Tenho oportunidades de desenvolvimento profissional', 22, 'reconhecimento_crescimento', 1.0),
    (existing_template_id, 'Recebo feedback regular sobre meu desempenho', 23, 'reconhecimento_crescimento', 1.0),
    (existing_template_id, 'Vejo possibilidades de crescimento na carreira', 24, 'reconhecimento_crescimento', 1.0),
    (existing_template_id, 'Meu trabalho é valorizado pela organização', 25, 'reconhecimento_crescimento', 1.0);
    
    -- CATEGORIA 6: ELO TRABALHO-VIDA SOCIAL (4 perguntas)
    INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
    (existing_template_id, 'Consigo equilibrar trabalho e vida pessoal', 26, 'elo_trabalho_vida_social', 1.0),
    (existing_template_id, 'Os horários de trabalho interferem na minha vida familiar', 27, 'elo_trabalho_vida_social', 1.0),
    (existing_template_id, 'Tenho flexibilidade de horários quando necessário', 28, 'elo_trabalho_vida_social', 1.0),
    (existing_template_id, 'O trabalho me permite tempo para atividades pessoais', 29, 'elo_trabalho_vida_social', 1.0);
    
    -- CATEGORIA 7: SUPORTE SOCIAL (4 perguntas)
    INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
    (existing_template_id, 'Recebo apoio dos colegas quando preciso', 30, 'suporte_social', 1.0),
    (existing_template_id, 'Meu supervisor me oferece suporte quando necessário', 31, 'suporte_social', 1.0),
    (existing_template_id, 'Posso contar com ajuda da equipe em situações difíceis', 32, 'suporte_social', 1.0),
    (existing_template_id, 'Sinto-me parte de um grupo de trabalho unido', 33, 'suporte_social', 1.0);
    
    -- CATEGORIA 8: CLAREZA DE PAPEL (4 perguntas)
    INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
    (existing_template_id, 'Sei exatamente o que é esperado de mim no trabalho', 34, 'clareza_papel', 1.0),
    (existing_template_id, 'Tenho objetivos claros e bem definidos', 35, 'clareza_papel', 1.0),
    (existing_template_id, 'Minhas responsabilidades são bem delimitadas', 36, 'clareza_papel', 1.0),
    (existing_template_id, 'Recebo informações claras sobre procedimentos de trabalho', 37, 'clareza_papel', 1.0);
    
    -- CATEGORIA 9: RECONHECIMENTO E RECOMPENSAS (4 perguntas)
    INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
    (existing_template_id, 'A remuneração é adequada ao trabalho que realizo', 38, 'reconhecimento_recompensas', 1.0),
    (existing_template_id, 'Existem sistemas justos de avaliação de desempenho', 39, 'reconhecimento_recompensas', 1.0),
    (existing_template_id, 'Recebo benefícios adequados da empresa', 40, 'reconhecimento_recompensas', 1.0),
    (existing_template_id, 'Há equidade no tratamento entre os funcionários', 41, 'reconhecimento_recompensas', 1.0);
    
    -- CATEGORIA 10: GESTÃO DE MUDANÇAS (3 perguntas)
    INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
    (existing_template_id, 'Sou informado adequadamente sobre mudanças na empresa', 42, 'gestao_mudancas', 1.0),
    (existing_template_id, 'Tenho participação nas decisões que afetam meu trabalho', 43, 'gestao_mudancas', 1.0),
    (existing_template_id, 'Mudanças organizacionais são implementadas de forma adequada', 44, 'gestao_mudancas', 1.0);
    
    -- CATEGORIA 11: IMPACTOS NA SAÚDE (5 perguntas)
    INSERT INTO questions (template_id, question_text, order_number, target_factor, weight) VALUES
    (existing_template_id, 'O trabalho causa fadiga excessiva', 45, 'impactos_saude', 1.0),
    (existing_template_id, 'Sinto sintomas de estresse relacionados ao trabalho', 46, 'impactos_saude', 1.0),
    (existing_template_id, 'Tenho problemas de sono relacionados ao trabalho', 47, 'impactos_saude', 1.0),
    (existing_template_id, 'O trabalho afeta meu bem-estar emocional', 48, 'impactos_saude', 1.0),
    (existing_template_id, 'Sinto sintomas físicos relacionados ao trabalho (dores, tensão)', 49, 'impactos_saude', 1.0);
    
    RAISE NOTICE 'Template "Avaliação Psicossocial - MTE Completa" configurado com 49 perguntas em 11 categorias.';
END $$;

-- Verificar se as perguntas foram criadas corretamente
SELECT 
    ct.title,
    ct.type,
    ct.scale_type,
    COUNT(q.id) as total_perguntas,
    ct.estimated_time_minutes
FROM checklist_templates ct
LEFT JOIN questions q ON ct.id = q.template_id
WHERE ct.title = 'Avaliação Psicossocial - MTE Completa'
GROUP BY ct.id, ct.title, ct.type, ct.scale_type, ct.estimated_time_minutes;

-- Verificar distribuição por categoria
SELECT 
    q.target_factor as categoria,
    COUNT(*) as quantidade_perguntas
FROM checklist_templates ct
JOIN questions q ON ct.id = q.template_id
WHERE ct.title = 'Avaliação Psicossocial - MTE Completa'
GROUP BY q.target_factor
ORDER BY q.target_factor;
