-- Criar tags comportamentais padrão se não existirem
INSERT INTO employee_tag_types (name, description, category, is_active) 
VALUES 
  ('Comprometido', 'Pessoa comprometida com suas responsabilidades', 'comportamental', true),
  ('Atento', 'Pessoa que presta atenção aos detalhes', 'comportamental', true),
  ('Proativo', 'Pessoa que toma iniciativas', 'comportamental', true),
  ('Comunicativo', 'Pessoa com boa comunicação', 'comportamental', true),
  ('Liderança', 'Pessoa com habilidades de liderança', 'comportamental', true),
  ('Trabalho em Equipe', 'Pessoa que trabalha bem em equipe', 'comportamental', true),
  ('Criativo', 'Pessoa criativa e inovadora', 'comportamental', true),
  ('Organizado', 'Pessoa organizada e metodica', 'comportamental', true)
ON CONFLICT (name) DO NOTHING;