
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.22.0";
import { Resend } from "npm:resend@2.0.0";

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
  console.log('=== RESEND EMAIL FUNCTION STARTED ===');
  console.log('Request method:', req.method);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('Step 1: Initializing Resend and Supabase...');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY não configurada');
    }
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configuração do Supabase não encontrada');
    }
    
    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Resend and Supabase initialized successfully');
    
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
    
    console.log('Step 3: Preparing email content...');
    let emailSubject = requestData.customSubject || `Convite para Avaliação Psicossocial - ${requestData.employeeName}`;
    let emailBody = requestData.customBody || `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #2563eb;">Convite para Avaliação Psicossocial</h2>
  
  <p>Prezado(a) <strong>${requestData.employeeName}</strong>,</p>
  
  <p>Você foi convidado(a) a participar de uma avaliação psicossocial como parte do programa de saúde e bem-estar da empresa.</p>
  
  <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; font-size: 16px;">
      🔗 <strong>Link para a avaliação:</strong><br>
      <a href="${requestData.linkUrl}" style="color: #2563eb; text-decoration: none; word-break: break-all;">${requestData.linkUrl}</a>
    </p>
  </div>
  
  <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #92400e;">Informações importantes:</h3>
    <ul style="margin-bottom: 0;">
      <li>A avaliação é confidencial e os dados serão tratados de acordo com a LGPD</li>
      <li>Tempo estimado: 15-20 minutos</li>
      <li>Prazo para conclusão: 7 dias</li>
      <li>Em caso de dúvidas, entre em contato com o RH</li>
    </ul>
  </div>
  
  <p>Sua participação é fundamental para promovermos um ambiente de trabalho mais saudável e produtivo.</p>
  
  <p style="margin-top: 30px;">
    Atenciosamente,<br>
    <strong>Equipe de Recursos Humanos</strong>
  </p>
  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  <p style="font-size: 12px; color: #6b7280;">
    Este é um email automático. Por favor, não responda a este email.
  </p>
</div>
    `.trim();

    console.log('Step 4: Sending email via Resend...');
    const emailResult = await resend.emails.send({
      from: 'Sistema de Avaliações <noreply@yourdomain.com>',
      to: [requestData.employeeEmail],
      subject: emailSubject,
      html: emailBody,
      text: emailBody.replace(/<[^>]*>/g, '').replace(/\n\s*\n/g, '\n').trim()
    });

    if (emailResult.error) {
      console.error('Resend email error:', emailResult.error);
      throw new Error(`Falha ao enviar email: ${emailResult.error.message}`);
    }
    
    console.log('Email sent successfully via Resend:', emailResult.data);
    
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
        emailSent: true,
        emailId: emailResult.data?.id
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('=== ERROR IN RESEND EMAIL FUNCTION ===');
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
