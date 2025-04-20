
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";
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
    
    // Map template names
    const templateName = requestData.emailTemplateId || "Convite";
    
    // Try to get the email template
    const emailTemplate = await fetchEmailTemplate(supabase, requestData.emailTemplateId!, templateName) 
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
    
    // In a real app, send email here via Resend, SendGrid, or other provider
    console.log(`Sending assessment email to ${requestData.employeeName} (${requestData.employeeEmail})`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body: ${emailBody}`);
    console.log(`Assessment link: ${requestData.linkUrl}`);
    
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

