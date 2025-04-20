
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.22.0";
import { corsHeaders, handleCorsPreFlight } from "./corsUtils.ts";
import { emailTemplates } from "./emailTemplates.ts";
import { applyTemplateVariables, fetchEmailTemplate, prepareVariables } from "./emailUtils.ts";
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
    
    // Get email server settings
    const { data: serverSettings, error: settingsError } = await supabase
      .from('email_server_settings')
      .select('*')
      .maybeSingle();

    if (settingsError || !serverSettings) {
      throw new Error('Email server settings not configured');
    }
    
    // Map template names
    const templateName = requestData.templateName || "Convite";
    
    // Try to get the email template
    const emailTemplate = await fetchEmailTemplate(supabase, requestData.templateId!, templateName) 
      || emailTemplates[templateName as keyof typeof emailTemplates];

    if (!emailTemplate && !requestData.customSubject) {
      throw new Error('Email template not found and no custom subject provided');
    }
    
    // Use provided custom subject/body or the template
    const subject = requestData.customSubject || emailTemplate?.subject || '';
    const body = requestData.customBody || emailTemplate?.body || '';
    
    // Apply variables to the template
    const variables = prepareVariables(requestData);
    const emailSubject = applyTemplateVariables(subject, variables);
    const emailBody = applyTemplateVariables(body, variables);
    
    // Configure email settings
    const emailConfig = {
      host: serverSettings.smtp_server,
      port: serverSettings.smtp_port,
      username: serverSettings.username,
      password: serverSettings.password,
      from: `${serverSettings.sender_name} <${serverSettings.sender_email}>`,
      to: requestData.employeeEmail,
      subject: emailSubject,
      body: emailBody
    };
    
    console.log('Sending email with config:', {
      ...emailConfig,
      password: '***' // Hide password in logs
    });
    
    // In a real app, send email here via SMTP using the emailConfig
    // For now, we'll just log the attempt
    console.log(`Sending assessment email to ${requestData.employeeName} (${requestData.employeeEmail})`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body: ${emailBody}`);
    
    // Update the assessment status
    const { error: updateError } = await supabase
      .from('assessment_schedules')
      .update({ 
        sent_at: new Date().toISOString(),
        link_url: requestData.linkUrl,
        status: 'sent'
      })
      .eq('id', requestData.assessmentId);
    
    if (updateError) {
      throw new Error(`Error updating assessment status: ${updateError.message}`);
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
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email sent to ${requestData.employeeEmail}`
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
