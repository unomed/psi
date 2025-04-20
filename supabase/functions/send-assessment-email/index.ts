
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
  emailTemplateId?: string;
  customSubject?: string;
  customBody?: string;
}

// Email templates (in a real app, these would come from the database)
const emailTemplates = {
  "convite": {
    subject: "Convite para participar de uma avaliação psicossocial",
    body: `Olá {employeeName},

Você foi convidado(a) a participar de uma avaliação psicossocial. 
Por favor, acesse o link abaixo para completar a avaliação.

Link da avaliação: {linkUrl}

Se tiver qualquer dúvida, entre em contato com o RH.

Atenciosamente,
Equipe de Recursos Humanos`
  },
  "lembrete": {
    subject: "Lembrete: Avaliação psicossocial pendente",
    body: `Olá {employeeName},

Este é um lembrete de que você tem uma avaliação psicossocial pendente que precisa ser concluída.

Link da avaliação: {linkUrl}

A sua participação é muito importante.

Atenciosamente,
Equipe de Recursos Humanos`
  },
  "conclusao": {
    subject: "Sua avaliação psicossocial foi concluída",
    body: `Olá {employeeName},

Gostaríamos de informar que você concluiu com sucesso a avaliação psicossocial.

Agradecemos sua participação e comprometimento.

Atenciosamente,
Equipe de Recursos Humanos`
  },
  
  // Maintain compatibility with old English IDs
  "assessment-invitation": {
    subject: "Convite para participar de uma avaliação psicossocial",
    body: `Olá {employeeName},

Você foi convidado(a) a participar de uma avaliação psicossocial. 
Por favor, acesse o link abaixo para completar a avaliação.

Link da avaliação: {linkUrl}

Se tiver qualquer dúvida, entre em contato com o RH.

Atenciosamente,
Equipe de Recursos Humanos`
  },
  "assessment-reminder": {
    subject: "Lembrete: Avaliação psicossocial pendente",
    body: `Olá {employeeName},

Este é um lembrete de que você tem uma avaliação psicossocial pendente que precisa ser concluída.

Link da avaliação: {linkUrl}

A sua participação é muito importante.

Atenciosamente,
Equipe de Recursos Humanos`
  },
  "assessment-completion": {
    subject: "Sua avaliação psicossocial foi concluída",
    body: `Olá {employeeName},

Gostaríamos de informar que você concluiu com sucesso a avaliação psicossocial.

Agradecemos sua participação e comprometimento.

Atenciosamente,
Equipe de Recursos Humanos`
  }
};

// Function to apply template variables
const applyTemplateVariables = (
  template: string, 
  variables: Record<string, string>
): string => {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  
  return result;
};

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
    
    // Get the email template to use (default to convite if not specified)
    const templateId = requestData.emailTemplateId || "convite";
    const emailTemplate = emailTemplates[templateId as keyof typeof emailTemplates];
    
    if (!emailTemplate && !requestData.customSubject) {
      throw new Error('Email template not found and no custom subject provided');
    }
    
    // Use provided custom subject/body or the template
    const subject = requestData.customSubject || emailTemplate.subject;
    const body = requestData.customBody || emailTemplate.body;
    
    // Apply variables to the template
    const variables = {
      employeeName: requestData.employeeName,
      employeeEmail: requestData.employeeEmail,
      linkUrl: requestData.linkUrl,
      assessmentId: requestData.assessmentId,
      templateName: requestData.templateName
    };
    
    const emailSubject = applyTemplateVariables(subject, variables);
    const emailBody = applyTemplateVariables(body, variables);
    
    // In a real app, you would use a service like Resend, SendGrid, or other email provider
    // For this demo, we'll just log the email we would send
    console.log(`Sending assessment email to ${requestData.employeeName} (${requestData.employeeEmail})`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body: ${emailBody}`);
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
