
-- Criar enum para tipos de ação de auditoria
CREATE TYPE audit_action_type AS ENUM (
  'create', 'read', 'update', 'delete', 'login', 'logout', 
  'export', 'import', 'email_send', 'permission_change',
  'assessment_complete', 'report_generate'
);

-- Criar enum para módulos do sistema
CREATE TYPE audit_module AS ENUM (
  'auth', 'companies', 'employees', 'roles', 'sectors', 
  'assessments', 'reports', 'billing', 'settings', 'risks'
);

-- Criar tabela de logs de auditoria
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action_type audit_action_type NOT NULL,
  module audit_module NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  description TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  company_id UUID REFERENCES companies(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_module_action ON audit_logs(module, action_type);

-- Habilitar RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política para superadmins verem todos os logs
CREATE POLICY "Superadmins can view all audit logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (is_superadmin(auth.uid()));

-- Política para usuários verem logs de suas empresas
CREATE POLICY "Users can view company audit logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (
    company_id IS NULL OR 
    user_has_company_access(company_id, auth.uid())
  );

-- Função para criar log de auditoria
CREATE OR REPLACE FUNCTION create_audit_log(
  p_action_type audit_action_type,
  p_module audit_module,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_description TEXT DEFAULT '',
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_company_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action_type,
    module,
    resource_type,
    resource_id,
    description,
    old_values,
    new_values,
    company_id,
    metadata
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_module,
    p_resource_type,
    p_resource_id,
    p_description,
    p_old_values,
    p_new_values,
    p_company_id,
    p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Preparação para Asaas: tabelas de eventos de cobrança
CREATE TABLE billing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  asaas_event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_billing_events_company_id ON billing_events(company_id);
CREATE INDEX idx_billing_events_processed ON billing_events(processed);
CREATE INDEX idx_billing_events_event_type ON billing_events(event_type);

-- Tabela de logs de pagamento
CREATE TABLE payment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  invoice_id UUID REFERENCES invoices(id),
  asaas_payment_id TEXT,
  payment_status TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE,
  webhook_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_payment_logs_company_id ON payment_logs(company_id);
CREATE INDEX idx_payment_logs_invoice_id ON payment_logs(invoice_id);
CREATE INDEX idx_payment_logs_status ON payment_logs(payment_status);
