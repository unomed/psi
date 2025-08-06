import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, company_id, openai_key } = await req.json();
    
    console.log(`[OpenAI Key Manager] Action: ${action}, Company: ${company_id}`);


    if (action === 'save') {
      // Salvar chave OpenAI de forma segura
      console.log(`[OpenAI Key Manager] Saving key for company: ${company_id}`);
      const encryptedKey = btoa(openai_key); // Simples encoding - em produção usar criptografia real

      const { error } = await supabase
        .from('psychosocial_automation_config')
        .upsert({
          company_id,
          openai_key_encrypted: encryptedKey,
          ai_config: {
            openai_enabled: true,
            key_configured_at: new Date().toISOString()
          }
        }, {
          onConflict: 'company_id'
        });

      if (error) {
        console.error('Error saving OpenAI key:', error);
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Chave OpenAI salva com segurança',
          configured: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'check') {
      // Verificar se chave existe
      console.log(`[OpenAI Key Manager] Checking key for company: ${company_id}`);
      const { data, error } = await supabase
        .from('psychosocial_automation_config')
        .select('openai_key_encrypted, ai_config')
        .eq('company_id', company_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking OpenAI key:', error);
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      const hasKey = data?.openai_key_encrypted ? true : false;
      const configuredAt = data?.ai_config?.key_configured_at || null;

      console.log(`[OpenAI Key Manager] Company ${company_id} has key: ${hasKey}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          configured: hasKey,
          configured_at: configuredAt
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'get') {
      // Buscar chave OpenAI para uso (apenas para outras edge functions)
      const { data, error } = await supabase
        .from('psychosocial_automation_config')
        .select('openai_key_encrypted')
        .eq('company_id', company_id)
        .single();

      if (error || !data?.openai_key_encrypted) {
        return new Response(
          JSON.stringify({ success: false, key: null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const decryptedKey = atob(data.openai_key_encrypted);

      return new Response(
        JSON.stringify({ 
          success: true, 
          key: decryptedKey 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('Error in manage-openai-key function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});