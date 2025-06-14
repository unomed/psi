
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
    
    // Gerar QR Code para o portal do funcionário
    const employeePortalUrl = `${req.headers.get('origin') || 'https://your-domain.com'}/funcionario`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(employeePortalUrl)}`;
    
    let emailSubject = requestData.customSubject || `Convite para Avaliação Psicossocial - ${requestData.employeeName}`;
    let emailBody = requestData.customBody || `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🏢 Convite para Avaliação</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Programa de Saúde e Bem-estar</p>
  </div>
  
  <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; margin-bottom: 20px;">Prezado(a) <strong>${requestData.employeeName}</strong>,</p>
    
    <p style="margin-bottom: 20px;">Você foi convidado(a) a participar de uma avaliação psicossocial como parte do programa de saúde e bem-estar da empresa.</p>
    
    <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
      <h3 style="margin-top: 0; color: #2563eb; font-size: 18px;">🔗 Duas maneiras de acessar:</h3>
      
      <div style="margin: 20px 0;">
        <p style="margin-bottom: 10px; font-weight: bold;">1. Link direto para a avaliação:</p>
        <a href="${requestData.linkUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">🚀 Responder Avaliação</a>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="margin-bottom: 15px; font-weight: bold;">2. Portal do Funcionário (escaneie o QR Code):</p>
        <img src="${qrCodeUrl}" alt="QR Code Portal do Funcionário" style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px; background: white;">
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
          Ou acesse: <a href="${employeePortalUrl}" style="color: #667eea;">${employeePortalUrl}</a>
        </p>
      </div>
    </div>
    
    <div style="background-color: #fef3c7; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #f59e0b;">
      <h3 style="margin-top: 0; color: #92400e; font-size: 16px;">⚡ Portal do Funcionário - Novidade!</h3>
      <ul style="margin-bottom: 0; color: #92400e;">
        <li>Acesse com seu CPF + últimos 4 dígitos</li>
        <li>Veja todas suas avaliações pendentes</li>
        <li>Registre seu humor diário 😊</li>
        <li>Acompanhe suas estatísticas pessoais</li>
      </ul>
    </div>
    
    <div style="background-color: #ecfdf5; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #10b981;">
      <h3 style="margin-top: 0; color: #047857; font-size: 16px;">📋 Informações importantes:</h3>
      <ul style="margin-bottom: 0; color: #047857;">
        <li>A avaliação é confidencial e os dados são protegidos pela LGPD</li>
        <li>Tempo estimado: 15-20 minutos</li>
        <li>Prazo para conclusão: 7 dias</li>
        <li>Em caso de dúvidas, entre em contato com o RH</li>
      </ul>
    </div>
    
    <p style="margin: 30px 0 20px 0;">Sua participação é fundamental para promovermos um ambiente de trabalho mais saudável e produtivo.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        Atenciosamente,<br>
        <strong style="color: #374151;">Equipe de Recursos Humanos</strong>
      </p>
    </div>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
    <p style="margin: 0;">Este é um email automático. Por favor, não responda a este email.</p>
  </div>
</div>
    `.trim();

    console.log('Step 4: Sending email via Resend...');
    const emailResult = await resend.emails.send({
      from: 'Sistema de Avaliações <noreply@avaliacao.unomed.med.br>',
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
        emailId: emailResult.data?.id,
        qrCodeGenerated: true,
        employeePortalUrl: employeePortalUrl
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
