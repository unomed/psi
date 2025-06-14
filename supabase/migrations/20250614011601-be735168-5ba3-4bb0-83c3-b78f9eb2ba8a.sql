
-- Tabela de planos de cobrança
CREATE TABLE public.billing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pay_per_assessment', 'credits', 'hybrid', 'volume')),
  assessment_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  bulk_discounts JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de configuração de cobrança por empresa
CREATE TABLE public.company_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  billing_plan_id UUID NOT NULL REFERENCES billing_plans(id),
  assessment_credit_balance INTEGER NOT NULL DEFAULT 0,
  auto_recharge_enabled BOOLEAN NOT NULL DEFAULT false,
  auto_recharge_threshold INTEGER DEFAULT 10,
  auto_recharge_amount INTEGER DEFAULT 50,
  payment_method TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- Tabela de registros de cobrança por avaliação
CREATE TABLE public.assessment_billing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_response_id UUID NOT NULL REFERENCES assessment_responses(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  amount_charged DECIMAL(10,2) NOT NULL,
  billing_status TEXT NOT NULL DEFAULT 'pending' CHECK (billing_status IN ('pending', 'charged', 'credited', 'failed')),
  invoice_id UUID,
  charged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de faturas consolidadas
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  assessment_count INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2) NOT NULL,
  discounts_applied DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de transações de pagamento
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  stripe_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de compras de créditos
CREATE TABLE public.credit_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  credits_purchased INTEGER NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  payment_transaction_id UUID REFERENCES payment_transactions(id),
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_purchases ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para billing_plans (visível para todos, editável apenas por superadmin)
CREATE POLICY "billing_plans_select" ON public.billing_plans FOR SELECT USING (true);
CREATE POLICY "billing_plans_superadmin" ON public.billing_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
);

-- Políticas RLS para company_billing (empresas podem ver apenas seus dados)
CREATE POLICY "company_billing_select" ON public.company_billing FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin') OR
  EXISTS (SELECT 1 FROM user_companies WHERE user_id = auth.uid() AND company_id = company_billing.company_id::text)
);

CREATE POLICY "company_billing_update" ON public.company_billing FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin') OR
  EXISTS (SELECT 1 FROM user_companies WHERE user_id = auth.uid() AND company_id = company_billing.company_id::text)
);

-- Políticas similares para as outras tabelas
CREATE POLICY "assessment_billing_records_select" ON public.assessment_billing_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin') OR
  EXISTS (SELECT 1 FROM user_companies WHERE user_id = auth.uid() AND company_id = assessment_billing_records.company_id::text)
);

CREATE POLICY "invoices_select" ON public.invoices FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin') OR
  EXISTS (SELECT 1 FROM user_companies WHERE user_id = auth.uid() AND company_id = invoices.company_id::text)
);

CREATE POLICY "payment_transactions_select" ON public.payment_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin') OR
  EXISTS (SELECT 1 FROM user_companies WHERE user_id = auth.uid() AND company_id = payment_transactions.company_id::text)
);

CREATE POLICY "credit_purchases_select" ON public.credit_purchases FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin') OR
  EXISTS (SELECT 1 FROM user_companies WHERE user_id = auth.uid() AND company_id = credit_purchases.company_id::text)
);

-- Políticas de inserção para edge functions (usando service role)
CREATE POLICY "assessment_billing_records_insert" ON public.assessment_billing_records FOR INSERT WITH CHECK (true);
CREATE POLICY "invoices_insert" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "payment_transactions_insert" ON public.payment_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "credit_purchases_insert" ON public.credit_purchases FOR INSERT WITH CHECK (true);
CREATE POLICY "company_billing_insert" ON public.company_billing FOR INSERT WITH CHECK (true);

-- Função para processar cobrança de avaliação
CREATE OR REPLACE FUNCTION public.process_assessment_billing()
RETURNS TRIGGER AS $$
DECLARE
  company_uuid UUID;
  billing_config RECORD;
  billing_plan RECORD;
  charge_amount DECIMAL(10,2);
BEGIN
  -- Só processar se a avaliação foi completada
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    -- Buscar a empresa do funcionário
    SELECT e.company_id INTO company_uuid
    FROM employees e
    WHERE e.id = NEW.employee_id;
    
    IF company_uuid IS NOT NULL THEN
      -- Buscar configuração de cobrança da empresa
      SELECT cb.*, bp.* INTO billing_config
      FROM company_billing cb
      JOIN billing_plans bp ON cb.billing_plan_id = bp.id
      WHERE cb.company_id = company_uuid AND bp.is_active = true;
      
      IF billing_config.assessment_price IS NOT NULL THEN
        charge_amount := billing_config.assessment_price;
        
        -- Se a empresa tem créditos, debitar
        IF billing_config.assessment_credit_balance > 0 THEN
          UPDATE company_billing 
          SET assessment_credit_balance = assessment_credit_balance - 1,
              updated_at = now()
          WHERE company_id = company_uuid;
          
          -- Registrar como creditado
          INSERT INTO assessment_billing_records (
            assessment_response_id,
            company_id,
            amount_charged,
            billing_status,
            charged_at
          ) VALUES (
            NEW.id,
            company_uuid,
            charge_amount,
            'credited',
            now()
          );
        ELSE
          -- Registrar para faturamento
          INSERT INTO assessment_billing_records (
            assessment_response_id,
            company_id,
            amount_charged,
            billing_status
          ) VALUES (
            NEW.id,
            company_uuid,
            charge_amount,
            'pending'
          );
        END IF;
        
        -- Verificar se precisa de recarga automática
        IF billing_config.auto_recharge_enabled = true 
           AND billing_config.assessment_credit_balance <= billing_config.auto_recharge_threshold THEN
          -- Aqui você pode chamar uma função para processar recarga automática
          -- Por enquanto, apenas log
          RAISE NOTICE 'Auto-recharge needed for company %', company_uuid;
        END IF;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para processar cobrança automaticamente
CREATE TRIGGER assessment_billing_trigger
  AFTER UPDATE ON assessment_responses
  FOR EACH ROW
  EXECUTE FUNCTION process_assessment_billing();

-- Inserir planos padrão
INSERT INTO billing_plans (name, type, assessment_price, description, bulk_discounts) VALUES
('Pay per Assessment', 'pay_per_assessment', 15.00, 'Pague apenas pelas avaliações realizadas', '[]'),
('Pacote 50 Avaliações', 'credits', 12.00, '50 avaliações com 20% de desconto', '[{"quantity": 50, "unit_price": 12.00, "discount_percent": 20}]'),
('Pacote 100 Avaliações', 'credits', 10.00, '100 avaliações com 33% de desconto', '[{"quantity": 100, "unit_price": 10.00, "discount_percent": 33}]'),
('Pacote 500 Avaliações', 'credits', 8.00, '500 avaliações com 47% de desconto', '[{"quantity": 500, "unit_price": 8.00, "discount_percent": 47}]');

-- Função para gerar número de fatura único
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year_month TEXT;
  sequence_num INTEGER;
  invoice_num TEXT;
BEGIN
  year_month := to_char(now(), 'YYYYMM');
  
  SELECT COALESCE(MAX(CAST(substring(invoice_number FROM length(year_month) + 2) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM invoices
  WHERE invoice_number LIKE year_month || '%';
  
  invoice_num := year_month || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamps
CREATE TRIGGER update_billing_plans_timestamp BEFORE UPDATE ON billing_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_billing_timestamp BEFORE UPDATE ON company_billing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_billing_records_timestamp BEFORE UPDATE ON assessment_billing_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_timestamp BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_timestamp BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credit_purchases_timestamp BEFORE UPDATE ON credit_purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
