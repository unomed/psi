
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

    // Calcular período de faturamento (mês anterior)
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const periodStart = lastMonth.toISOString().split('T')[0];
    const periodEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];

    console.log(`Generating invoices for period: ${periodStart} to ${periodEnd}`);

    // Buscar registros de cobrança pendentes do mês anterior
    const { data: pendingRecords, error: fetchError } = await supabaseClient
      .from('assessment_billing_records')
      .select(`
        *,
        companies(name, cnpj)
      `)
      .eq('billing_status', 'pending')
      .gte('created_at', `${periodStart}T00:00:00Z`)
      .lte('created_at', `${periodEnd}T23:59:59Z`);

    if (fetchError) {
      console.error('Error fetching pending records:', fetchError);
      throw fetchError;
    }

    if (!pendingRecords || pendingRecords.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No pending billing records found for the period',
          period: { start: periodStart, end: periodEnd }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Agrupar por empresa
    const recordsByCompany = pendingRecords.reduce((acc, record) => {
      const companyId = record.company_id;
      if (!acc[companyId]) {
        acc[companyId] = {
          company: record.companies,
          records: []
        };
      }
      acc[companyId].records.push(record);
      return acc;
    }, {} as Record<string, any>);

    const invoiceResults = [];

    // Gerar fatura para cada empresa
    for (const [companyId, companyData] of Object.entries(recordsByCompany)) {
      try {
        const records = companyData.records;
        const totalAmount = records.reduce((sum: number, record: any) => sum + record.amount_charged, 0);
        const assessmentCount = records.length;
        const unitPrice = assessmentCount > 0 ? totalAmount / assessmentCount : 0;

        // Gerar número da fatura
        const { data: invoiceNumber, error: numberError } = await supabaseClient
          .rpc('generate_invoice_number');

        if (numberError) {
          console.error('Error generating invoice number:', numberError);
          throw numberError;
        }

        // Criar fatura
        const invoice = {
          company_id: companyId,
          invoice_number: invoiceNumber,
          billing_period_start: periodStart,
          billing_period_end: periodEnd,
          total_amount: totalAmount,
          assessment_count: assessmentCount,
          unit_price: unitPrice,
          discounts_applied: 0,
          status: 'pending',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
          created_at: new Date().toISOString()
        };

        const { data: createdInvoice, error: invoiceError } = await supabaseClient
          .from('invoices')
          .insert(invoice)
          .select()
          .single();

        if (invoiceError) {
          console.error(`Error creating invoice for company ${companyId}:`, invoiceError);
          throw invoiceError;
        }

        // Atualizar registros de cobrança
        const recordIds = records.map((r: any) => r.id);
        const { error: updateError } = await supabaseClient
          .from('assessment_billing_records')
          .update({ 
            billing_status: 'charged',
            invoice_id: createdInvoice.id,
            charged_at: new Date().toISOString()
          })
          .in('id', recordIds);

        if (updateError) {
          console.error(`Error updating billing records for company ${companyId}:`, updateError);
          throw updateError;
        }

        invoiceResults.push({
          company_id: companyId,
          company_name: companyData.company?.name,
          invoice_number: invoiceNumber,
          total_amount: totalAmount,
          assessment_count: assessmentCount,
          status: 'created'
        });

        console.log(`Invoice created for ${companyData.company?.name}: ${invoiceNumber} - ${totalAmount}`);

      } catch (error) {
        console.error(`Error processing invoice for company ${companyId}:`, error);
        invoiceResults.push({
          company_id: companyId,
          company_name: companyData.company?.name,
          status: 'error',
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        period: { start: periodStart, end: periodEnd },
        invoices_generated: invoiceResults.length,
        results: invoiceResults
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in generate-monthly-invoices function:', error);
    
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
