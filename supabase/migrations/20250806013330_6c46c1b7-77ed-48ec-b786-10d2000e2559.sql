-- Adicionar campo para armazenar chave OpenAI criptografada
ALTER TABLE psychosocial_automation_config 
ADD COLUMN IF NOT EXISTS openai_key_encrypted TEXT;