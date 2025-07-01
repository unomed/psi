
-- Corrigir Function Search Path para copy_template_for_company
CREATE OR REPLACE FUNCTION public.copy_template_for_company(template_id uuid, company_id uuid, new_title text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_template_id UUID;
  source_template RECORD;
  question RECORD;
BEGIN
  -- Get source template
  SELECT * INTO source_template FROM public.checklist_templates WHERE id = template_id;
  
  -- Create new template
  INSERT INTO public.checklist_templates (
    title,
    description,
    type,
    scale_type,
    is_active,
    is_standard,
    derived_from_id,
    company_id
  ) VALUES (
    COALESCE(new_title, 'Copy of ' || source_template.title),
    source_template.description,
    source_template.type,
    source_template.scale_type,
    true,
    false,
    template_id,
    company_id
  ) RETURNING id INTO new_template_id;
  
  -- Copy questions
  FOR question IN SELECT * FROM public.questions WHERE template_id = template_id
  LOOP
    INSERT INTO public.questions (
      template_id,
      question_text,
      order_number,
      target_factor,
      weight,
      reverse_scored
    ) VALUES (
      new_template_id,
      question.question_text,
      question.order_number,
      question.target_factor,
      question.weight,
      question.reverse_scored
    );
  END LOOP;
  
  RETURN new_template_id;
END;
$function$;

-- Corrigir Function Search Path para process_assessment_billing
CREATE OR REPLACE FUNCTION public.process_assessment_billing()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Corrigir generate_invoice_number function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Adicionar políticas RLS para system_settings (resolvendo RLS Enabled No Policy)
CREATE POLICY "Superadmin can manage system settings" ON public.system_settings 
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
  );

CREATE POLICY "Admins can view system settings" ON public.system_settings 
  FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('superadmin', 'admin'))
  );

-- Adicionar políticas RLS para outras tabelas que podem estar sem políticas adequadas
CREATE POLICY "assessment_billing_records_superadmin" ON public.assessment_billing_records FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
);

CREATE POLICY "billing_plans_insert_superadmin" ON public.billing_plans FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
);

CREATE POLICY "billing_plans_update_superadmin" ON public.billing_plans FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
);

CREATE POLICY "billing_plans_delete_superadmin" ON public.billing_plans FOR DELETE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
);

CREATE POLICY "company_billing_superadmin" ON public.company_billing FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin')
);

-- Políticas para credit_purchases, invoices, payment_transactions já existem, mas vamos garantir que estão corretas
CREATE POLICY "credit_purchases_update" ON public.credit_purchases FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin') OR
  EXISTS (SELECT 1 FROM user_companies WHERE user_id = auth.uid() AND company_id = credit_purchases.company_id::text)
);

CREATE POLICY "invoices_update" ON public.invoices FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin') OR
  EXISTS (SELECT 1 FROM user_companies WHERE user_id = auth.uid() AND company_id = invoices.company_id::text)
);

CREATE POLICY "payment_transactions_update" ON public.payment_transactions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'superadmin') OR
  EXISTS (SELECT 1 FROM user_companies WHERE user_id = auth.uid() AND company_id = payment_transactions.company_id::text)
);
