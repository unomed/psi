
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0"

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  assessmentId: string;
  templateId: string;
  templateName: string;
  linkUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get request body
    const requestData: EmailRequest = await req.json();
    
    // In a real app, you would use a service like Resend, SendGrid, or other email provider
    // For this demo, we'll just log the email we would send
    console.log(`Sending assessment email to ${requestData.employeeName} (${requestData.employeeEmail})`);
    console.log(`Assessment link: ${requestData.linkUrl}`);
    
    // Update the assessment status in the database
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
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email sent to ${requestData.employeeEmail}`
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
})
