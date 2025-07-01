
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.22.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { recipient, subject, body, smtpSettings } = await req.json();
    
    // Get server settings from the database if not provided
    let emailConfig;
    if (!smtpSettings) {
      const { data: serverSettings, error: settingsError } = await supabase
        .from('email_server_settings')
        .select('*')
        .single();
      
      if (settingsError || !serverSettings) {
        throw new Error('Email server settings not configured');
      }
      
      emailConfig = {
        host: serverSettings.smtp_server,
        port: serverSettings.smtp_port,
        username: serverSettings.username,
        password: serverSettings.password,
        from: `${serverSettings.sender_name} <${serverSettings.sender_email}>`,
        to: recipient,
        subject,
        body
      };
    } else {
      emailConfig = {
        host: smtpSettings.server,
        port: smtpSettings.port,
        username: smtpSettings.username,
        password: smtpSettings.password,
        from: `${smtpSettings.senderName} <${smtpSettings.senderEmail}>`,
        to: recipient,
        subject,
        body
      };
    }
    
    // In a production environment, you would send an actual email here
    console.log('Would send test email with config:', {
      ...emailConfig,
      password: '***' // Hide password in logs
    });
    
    // For now, simulate successful email sending
    const result = {
      success: true,
      message: `Test email would be sent to ${recipient}`,
      timestamp: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in send-test-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500
      }
    );
  }
});
