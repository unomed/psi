
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    console.log('Webhook Asaas recebido:', JSON.stringify(body, null, 2));

    // Verificar se é um evento válido do Asaas
    if (!body.event || !body.payment) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook payload' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { event, payment } = body;
    
    // Buscar empresa pelo customer_id ou payment_id
    let companyId = null;
    
    // Tentar encontrar a empresa associada a este pagamento
    const { data: billingData } = await supabase
      .from('company_billing')
      .select('company_id')
      .eq('stripe_customer_id', payment.customer)
      .single();
    
    if (billingData) {
      companyId = billingData.company_id;
    }

    // Registrar evento de cobrança
    const { error: eventError } = await supabase
      .from('billing_events')
      .insert({
        company_id: companyId,
        asaas_event_id: body.id || `${event}_${Date.now()}`,
        event_type: event,
        event_data: body,
        processed: false
      });

    if (eventError) {
      console.error('Erro ao registrar evento:', eventError);
    }

    // Processar diferentes tipos de eventos
    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED':
        await processPaymentReceived(supabase, payment, companyId);
        break;
        
      case 'PAYMENT_OVERDUE':
        await processPaymentOverdue(supabase, payment, companyId);
        break;
        
      case 'PAYMENT_DELETED':
      case 'PAYMENT_REFUNDED':
        await processPaymentCancelled(supabase, payment, companyId);
        break;
        
      default:
        console.log(`Evento não processado: ${event}`);
    }

    // Registrar log de auditoria
    if (companyId) {
      await supabase.rpc('create_audit_log', {
        p_action_type: 'import',
        p_module: 'billing',
        p_resource_type: 'webhook',
        p_resource_id: payment.id,
        p_description: `Webhook Asaas processado: ${event}`,
        p_company_id: companyId,
        p_metadata: { event_type: event, payment_value: payment.value }
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro no webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function processPaymentReceived(supabase: any, payment: any, companyId: string | null) {
  console.log('Processando pagamento recebido:', payment.id);
  
  if (!companyId) {
    console.log('Company ID não encontrado para o pagamento');
    return;
  }

  // Registrar log de pagamento
  const { error: logError } = await supabase
    .from('payment_logs')
    .insert({
      company_id: companyId,
      asaas_payment_id: payment.id,
      payment_status: 'received',
      amount: payment.value,
      payment_date: payment.paymentDate || new Date().toISOString(),
      webhook_data: payment
    });

  if (logError) {
    console.error('Erro ao registrar log de pagamento:', logError);
  }

  // Atualizar status da fatura se existir
  const { data: invoice } = await supabase
    .from('invoices')
    .select('id')
    .eq('company_id', companyId)
    .eq('total_amount', payment.value)
    .eq('status', 'pending')
    .single();

  if (invoice) {
    await supabase
      .from('invoices')
      .update({
        status: 'paid',
        paid_at: payment.paymentDate || new Date().toISOString()
      })
      .eq('id', invoice.id);
  }

  // Ativar empresa se estava suspensa
  await supabase
    .from('company_billing')
    .update({
      payment_status: 'active'
    })
    .eq('company_id', companyId);
}

async function processPaymentOverdue(supabase: any, payment: any, companyId: string | null) {
  console.log('Processando pagamento em atraso:', payment.id);
  
  if (!companyId) return;

  // Registrar log
  await supabase
    .from('payment_logs')
    .insert({
      company_id: companyId,
      asaas_payment_id: payment.id,
      payment_status: 'overdue',
      amount: payment.value,
      webhook_data: payment
    });

  // Suspender empresa
  await supabase
    .from('company_billing')
    .update({
      payment_status: 'overdue'
    })
    .eq('company_id', companyId);
}

async function processPaymentCancelled(supabase: any, payment: any, companyId: string | null) {
  console.log('Processando pagamento cancelado/estornado:', payment.id);
  
  if (!companyId) return;

  // Registrar log
  await supabase
    .from('payment_logs')
    .insert({
      company_id: companyId,
      asaas_payment_id: payment.id,
      payment_status: 'cancelled',
      amount: payment.value,
      webhook_data: payment
    });
}
