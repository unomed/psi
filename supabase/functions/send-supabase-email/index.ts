
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.22.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  assessmentId: string;
  templateId?: string;
  templateName: string;
  linkUrl: string;
  customSubject?: string;
  customBody?: string;
}

serve(async (req) => {
  console.log('=== SUPABASE EMAIL FUNCTION STARTED ===');
  console.log('Request method:', req.method);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('Step 1: Creating Supabase client...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configuração do Supabase não encontrada');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created successfully');
    
    console.log('Step 2: Parsing request body...');
    const requestData: EmailRequest = await req.json();
    console.log('Request data received:', { 
      assessmentId: requestData.assessmentId,
      employeeId: requestData.employeeId,
      employeeName: requestData.employeeName,
      employeeEmail: requestData.employeeEmail,
      templateName: requestData.templateName,
      hasLinkUrl: !!requestData.linkUrl
    });
    
    if (!requestData.employeeEmail) {
      throw new Error('Email do funcionário não fornecido');
    }
    
    console.log('Step 3: Preparing email template...');
    let emailSubject = requestData.customSubject || `Convite para Avaliação Psicossocial - ${requestData.employeeName}`;
    let emailBody = requestData.customBody || `
Prezado(a) ${requestData.employeeName},

Você foi convidado(a) a participar de uma avaliação psicossocial como parte do programa de saúde e bem-estar da empresa.

🔗 **Link para a avaliação:** ${requestData.linkUrl}

**Informações importantes:**
• A avaliação é confidencial e os dados serão tratados de acordo com a LGPD
• Tempo estimado: 15-20 minutos
• Prazo para conclusão: 7 dias
• Em caso de dúvidas, entre em contato com o RH

Sua participação é fundamental para promovermos um ambiente de trabalho mais saudável e produtivo.

Atenciosamente,
Equipe de Recursos Humanos
    `.trim();

    console.log('Step 4: Sending email via Supabase Auth...');
    
    // Use Supabase Auth email service
    const { data: emailData, error: emailError } = await supabase.auth.admin.inviteUserByEmail(
      requestData.employeeEmail,
      {
        data: {
          assessment_link: requestData.linkUrl,
          employee_name: requestData.employeeName,
          assessment_id: requestData.assessmentId
        },
        redirectTo: requestData.linkUrl
      }
    );

    if (emailError) {
      console.error('Supabase email error:', emailError);
      
      // Fallback: Save to pending queue
      const { error: queueError } = await supabase
        .from('assessment_emails')
        .insert({
          scheduled_assessment_id: requestData.assessmentId,
          recipient_email: requestData.employeeEmail,
          subject: emailSubject,
          body: emailBody,
          delivery_status: 'failed',
          sent_at: null
        });
      
      if (queueError) {
        console.error('Failed to save to queue:', queueError);
      }
      
      throw new Error(`Falha ao enviar email: ${emailError.message}`);
    }
    
    console.log('Email sent successfully via Supabase');
    
    console.log('Step 5: Updating database records...');
    // Update the assessment status
    const { error: updateError } = await supabase
      .from('scheduled_assessments')
      .update({ 
        sent_at: new Date().toISOString(),
        link_url: requestData.linkUrl,
        status: 'sent'
      })
      .eq('id', requestData.assessmentId);
    
    if (updateError) {
      console.error('Error updating assessment status:', updateError);
    } else {
      console.log('Assessment status updated successfully');
    }
    
    // Record the email
    const { error: emailLogError } = await supabase
      .from('assessment_emails')
      .insert({
        scheduled_assessment_id: requestData.assessmentId,
        recipient_email: requestData.employeeEmail,
        subject: emailSubject,
        body: emailBody,
        delivery_status: 'sent',
        sent_at: new Date().toISOString()
      });

    if (emailLogError) {
      console.error('Error logging email:', emailLogError);
    } else {
      console.log('Email logged successfully');
    }
    
    console.log('=== EMAIL SENDING PROCESS COMPLETED ===');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email enviado com sucesso para ${requestData.employeeEmail}`,
        emailSent: true
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('=== ERROR IN SUPABASE EMAIL FUNCTION ===');
    console.error('Error:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        emailSent: false
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
