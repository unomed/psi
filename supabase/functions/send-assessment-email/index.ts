
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.22.0";
import { corsHeaders, handleCorsPreFlight } from "./corsUtils.ts";
import { emailTemplates } from "./emailTemplates.ts";
import { applyTemplateVariables, fetchEmailTemplate, prepareVariables } from "./emailUtils.ts";
import { sendEmailViaSMTP, type SMTPConfig, type EmailContent } from "./smtpService.ts";
import { EmailRequest } from "./types.ts";

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreFlight(req);
  if (corsResponse) return corsResponse;
  
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get request body
    const requestData: EmailRequest = await req.json();
    console.log('Request data:', { ...requestData, employeeEmail: requestData.employeeEmail });
    
    // Get email server settings
    const { data: serverSettings, error: settingsError } = await supabase
      .from('email_server_settings')
      .select('*')
      .maybeSingle();

    if (settingsError || !serverSettings) {
      console.error('Email server settings error:', settingsError);
      throw new Error('Configurações do servidor de email não encontradas. Configure primeiro em Configurações > Email.');
    }
    
    console.log('Server settings loaded:', {
      server: serverSettings.smtp_server,
      port: serverSettings.smtp_port,
      senderEmail: serverSettings.sender_email
    });
    
    // Map template names
    const templateName = requestData.templateName || "Convite";
    
    // Try to get the email template from database (using maybeSingle to avoid errors)
    let emailTemplate = null;
    if (requestData.templateId) {
      const { data: dbTemplate, error: templateError } = await supabase
        .from('email_templates')
        .select('subject, body')
        .eq('id', requestData.templateId)
        .limit(1)
        .maybeSingle();
        
      if (!templateError && dbTemplate) {
        emailTemplate = dbTemplate;
      }
    }
    
    // If no template found by ID, try by name (using limit and order to get most recent)
    if (!emailTemplate) {
      const { data: dbTemplate, error: templateError } = await supabase
        .from('email_templates')
        .select('subject, body')
        .eq('name', templateName)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (!templateError && dbTemplate) {
        emailTemplate = dbTemplate;
      }
    }
    
    // Fallback to default templates
    if (!emailTemplate) {
      emailTemplate = emailTemplates[templateName as keyof typeof emailTemplates];
    }

    if (!emailTemplate && !requestData.customSubject) {
      throw new Error(`Template de email "${templateName}" não encontrado e nenhum assunto personalizado fornecido`);
    }
    
    // Use provided custom subject/body or the template
    const subject = requestData.customSubject || emailTemplate?.subject || '';
    const body = requestData.customBody || emailTemplate?.body || '';
    
    // Apply variables to the template
    const variables = prepareVariables(requestData);
    const emailSubject = applyTemplateVariables(subject, variables);
    const emailBody = applyTemplateVariables(body, variables);
    
    console.log('Email content prepared:', {
      subject: emailSubject,
      bodyPreview: emailBody.substring(0, 100) + '...',
      variables
    });
    
    // Configure SMTP settings
    const smtpConfig: SMTPConfig = {
      server: serverSettings.smtp_server,
      port: serverSettings.smtp_port,
      username: serverSettings.username,
      password: serverSettings.password,
      senderEmail: serverSettings.sender_email,
      senderName: serverSettings.sender_name,
      useTLS: serverSettings.use_ssl ?? true
    };
    
    // Prepare email content
    const emailContent: EmailContent = {
      to: requestData.employeeEmail,
      subject: emailSubject,
      html: emailBody.replace(/\n/g, '<br>'),
      text: emailBody
    };
    
    console.log('Sending email via SMTP...');
    
    // Send email via SMTP
    const emailSent = await sendEmailViaSMTP(smtpConfig, emailContent);
    
    if (!emailSent) {
      throw new Error('Falha ao enviar email via SMTP');
    }
    
    console.log('Email sent successfully');
    
    // Update the assessment status in scheduled_assessments (not assessment_schedules)
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
      // Não falhar a requisição por causa disso, apenas logar
    }
    
    // Record the email in assessment_emails table
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
      // Não falhar a requisição por causa disso, apenas logar
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email enviado com sucesso para ${requestData.employeeEmail}`,
        emailSent: true
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('Error in send-assessment-email:', error);
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
