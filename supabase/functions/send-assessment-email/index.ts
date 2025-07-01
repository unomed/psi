
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.22.0";
import { corsHeaders, handleCorsPreFlight } from "./corsUtils.ts";
import { emailTemplates } from "./emailTemplates.ts";
import { applyTemplateVariables, fetchEmailTemplate, prepareVariables } from "./emailUtils.ts";
import { sendEmailViaSMTP, type SMTPConfig, type EmailContent } from "./smtpService.ts";
import { EmailRequest } from "./types.ts";

serve(async (req) => {
  console.log('=== SEND ASSESSMENT EMAIL FUNCTION STARTED ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  // Handle CORS preflight
  const corsResponse = handleCorsPreFlight(req);
  if (corsResponse) {
    console.log('Returning CORS preflight response');
    return corsResponse;
  }
  
  try {
    console.log('Step 1: Creating Supabase client...');
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Configuração do Supabase não encontrada');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created successfully');
    
    console.log('Step 2: Parsing request body...');
    // Get request body
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
      console.error('Employee email is missing from request');
      throw new Error('Email do funcionário não fornecido');
    }
    
    console.log('Step 3: Fetching email server settings...');
    // Get email server settings
    const { data: serverSettings, error: settingsError } = await supabase
      .from('email_server_settings')
      .select('*')
      .maybeSingle();

    console.log('Email server settings query result:', {
      hasData: !!serverSettings,
      error: settingsError,
      settingsPreview: serverSettings ? {
        server: serverSettings.smtp_server,
        port: serverSettings.smtp_port,
        username: serverSettings.username,
        senderEmail: serverSettings.sender_email,
        hasPassword: !!serverSettings.password
      } : null
    });

    if (settingsError) {
      console.error('Error fetching email server settings:', settingsError);
      throw new Error(`Erro ao buscar configurações de email: ${settingsError.message}`);
    }
    
    if (!serverSettings) {
      console.error('No email server settings found');
      throw new Error('Configurações do servidor de email não encontradas. Configure primeiro em Configurações > Email.');
    }
    
    // Validate required settings
    if (!serverSettings.smtp_server || !serverSettings.smtp_port || !serverSettings.username || !serverSettings.password || !serverSettings.sender_email) {
      console.error('Incomplete email server settings:', {
        hasServer: !!serverSettings.smtp_server,
        hasPort: !!serverSettings.smtp_port,
        hasUsername: !!serverSettings.username,
        hasPassword: !!serverSettings.password,
        hasSenderEmail: !!serverSettings.sender_email
      });
      throw new Error('Configurações de email incompletas. Verifique todas as configurações necessárias.');
    }
    
    console.log('Step 4: Processing email template...');
    // Map template names
    const templateName = requestData.templateName || "Convite";
    console.log('Using template name:', templateName);
    
    // Try to get the email template from database
    let emailTemplate = null;
    if (requestData.templateId) {
      console.log('Attempting to fetch template by ID:', requestData.templateId);
      const { data: dbTemplate, error: templateError } = await supabase
        .from('email_templates')
        .select('subject, body')
        .eq('id', requestData.templateId)
        .limit(1)
        .maybeSingle();
        
      if (!templateError && dbTemplate) {
        emailTemplate = dbTemplate;
        console.log('Template found by ID');
      } else if (templateError) {
        console.warn('Error fetching template by ID:', templateError);
      } else {
        console.log('No template found by ID');
      }
    }
    
    // If no template found by ID, try by name
    if (!emailTemplate) {
      console.log('Attempting to fetch template by name:', templateName);
      const { data: dbTemplate, error: templateError } = await supabase
        .from('email_templates')
        .select('subject, body')
        .eq('name', templateName)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (!templateError && dbTemplate) {
        emailTemplate = dbTemplate;
        console.log('Template found by name');
      } else if (templateError) {
        console.warn('Error fetching template by name:', templateError);
      } else {
        console.log('No template found by name');
      }
    }
    
    // Fallback to default templates
    if (!emailTemplate) {
      console.log('Using fallback template from code');
      emailTemplate = emailTemplates[templateName as keyof typeof emailTemplates];
    }

    if (!emailTemplate && !requestData.customSubject) {
      console.error('No template found and no custom subject provided');
      throw new Error(`Template de email "${templateName}" não encontrado e nenhum assunto personalizado fornecido`);
    }
    
    console.log('Step 5: Preparing email content...');
    // Use provided custom subject/body or the template
    const subject = requestData.customSubject || emailTemplate?.subject || '';
    const body = requestData.customBody || emailTemplate?.body || '';
    
    console.log('Email template prepared:', {
      hasSubject: !!subject,
      hasBody: !!body,
      subjectPreview: subject.substring(0, 50) + '...',
      bodyPreview: body.substring(0, 100) + '...'
    });
    
    // Apply variables to the template
    const variables = prepareVariables(requestData);
    const emailSubject = applyTemplateVariables(subject, variables);
    const emailBody = applyTemplateVariables(body, variables);
    
    console.log('Email content after variable substitution:', {
      finalSubject: emailSubject,
      finalBodyPreview: emailBody.substring(0, 100) + '...',
      variablesApplied: Object.keys(variables).length
    });
    
    console.log('Step 6: Configuring SMTP...');
    // Configure SMTP settings
    const smtpConfig: SMTPConfig = {
      server: serverSettings.smtp_server,
      port: serverSettings.smtp_port,
      username: serverSettings.username,
      password: serverSettings.password,
      senderEmail: serverSettings.sender_email,
      senderName: serverSettings.sender_name || 'Sistema de Avaliações',
      useTLS: serverSettings.use_ssl ?? true
    };
    
    console.log('SMTP configuration:', {
      server: smtpConfig.server,
      port: smtpConfig.port,
      username: smtpConfig.username,
      senderEmail: smtpConfig.senderEmail,
      senderName: smtpConfig.senderName,
      useTLS: smtpConfig.useTLS,
      hasPassword: !!smtpConfig.password
    });
    
    // Prepare email content
    const emailContent: EmailContent = {
      to: requestData.employeeEmail,
      subject: emailSubject,
      html: emailBody.replace(/\n/g, '<br>'),
      text: emailBody
    };
    
    console.log('Email content prepared:', {
      to: emailContent.to,
      subject: emailContent.subject,
      hasHtml: !!emailContent.html,
      hasText: !!emailContent.text
    });
    
    console.log('Step 7: Sending email via enhanced SMTP...');
    
    // Send email via enhanced SMTP service
    const emailSent = await sendEmailViaSMTP(smtpConfig, emailContent);
    
    if (!emailSent) {
      console.error('Enhanced SMTP sending failed completely');
      
      // In case of complete failure, save to pending queue for manual retry
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
        console.error('Failed to save to pending queue:', queueError);
      }
      
      throw new Error('Falha ao enviar email via SMTP - email salvo na fila para reenvio manual');
    }
    
    console.log('Email processing completed successfully');
    
    console.log('Step 8: Updating database records...');
    // Update the assessment status in scheduled_assessments
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
    } else {
      console.log('Assessment status updated successfully');
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
    } else {
      console.log('Email logged successfully');
    }
    
    console.log('=== EMAIL SENDING PROCESS COMPLETED SUCCESSFULLY ===');
    
    const isDevelopment = Deno.env.get('ENVIRONMENT') === 'development' || 
                         Deno.env.get('DENO_DEPLOYMENT_ID') === undefined;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email ${isDevelopment ? 'simulado' : 'enviado'} com sucesso para ${requestData.employeeEmail}`,
        emailSent: true,
        isDevelopment
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('=== ERROR IN SEND-ASSESSMENT-EMAIL ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        errorType: error.constructor.name,
        emailSent: false
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
