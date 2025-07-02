-- Verificar e ajustar políticas RLS para assessment_criteria_settings
-- Primeiro, vamos garantir que usuários autenticados possam atualizar a tabela

-- Remover políticas conflitantes se existirem
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON assessment_criteria_settings;
DROP POLICY IF EXISTS "Allow write access to authenticated users with edit_settings pe" ON assessment_criteria_settings;
DROP POLICY IF EXISTS "Only admins can manage assessment criteria settings" ON assessment_criteria_settings;

-- Criar políticas mais permissivas para usuários autenticados
CREATE POLICY "assessment_criteria_settings_select" ON assessment_criteria_settings
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "assessment_criteria_settings_update" ON assessment_criteria_settings
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "assessment_criteria_settings_insert" ON assessment_criteria_settings
    FOR INSERT TO authenticated
    WITH CHECK (true);