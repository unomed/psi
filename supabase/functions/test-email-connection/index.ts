
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { settings } = await req.json();
    
    if (!settings || !settings.smtp_server || !settings.smtp_port || 
        !settings.username || !settings.password) {
      throw new Error("Missing required email settings");
    }

    console.log("Testing connection to email server:", settings.smtp_server);
    
    // Create a TCP connection to the SMTP server directly
    const conn = await Deno.connect({
      hostname: settings.smtp_server,
      port: settings.smtp_port,
    });

    // Close the connection after successfully connecting
    conn.close();
    
    console.log("Connection successful, connection closed");

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error("Error testing email connection:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});
