
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Buscar empresas que precisam de recarga automática
    const { data: companiesNeedingRecharge, error: fetchError } = await supabaseClient
      .from('company_billing')
      .select(`
        *,
        companies(name, cnpj),
        billing_plans(*)
      `)
      .eq('auto_recharge_enabled', true)
      .filter('assessment_credit_balance', 'lte', 'auto_recharge_threshold');

    if (fetchError) {
      console.error('Error fetching companies needing recharge:', fetchError);
      throw fetchError;
    }

    const results = [];

    for (const companyBilling of companiesNeedingRecharge || []) {
      try {
        console.log(`Processing auto-recharge for company: ${companyBilling.companies?.name}`);
        
        // Aqui você integraria com o Stripe para processar o pagamento automaticamente
        // usando o payment_method armazenado ou criando uma nova sessão
        
        // Por enquanto, vamos apenas registrar a necessidade de recarga
        const rechargeRecord = {
          company_id: companyBilling.company_id,
          credits_purchased: companyBilling.auto_recharge_amount,
          amount_paid: companyBilling.auto_recharge_amount * (companyBilling.billing_plans?.assessment_price || 0),
          unit_price: companyBilling.billing_plans?.assessment_price || 0,
          status: 'pending',
          created_at: new Date().toISOString()
        };

        // Inserir registro de compra pendente
        const { error: insertError } = await supabaseClient
          .from('credit_purchases')
          .insert(rechargeRecord);

        if (insertError) {
          console.error(`Error creating recharge record for company ${companyBilling.company_id}:`, insertError);
          continue;
        }

        results.push({
          company_id: companyBilling.company_id,
          company_name: companyBilling.companies?.name,
          recharge_amount: companyBilling.auto_recharge_amount,
          status: 'pending_payment'
        });

      } catch (error) {
        console.error(`Error processing recharge for company ${companyBilling.company_id}:`, error);
        results.push({
          company_id: companyBilling.company_id,
          company_name: companyBilling.companies?.name,
          status: 'error',
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: results.length,
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in auto-recharge-credits function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
