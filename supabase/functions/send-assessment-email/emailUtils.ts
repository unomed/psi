
import { EmailRequest, EmailTemplate } from './types';
import { createClient } from '@supabase/supabase-js';

export function applyTemplateVariables(
  template: string, 
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  return result;
}

export async function fetchEmailTemplate(
  supabase: ReturnType<typeof createClient>,
  templateId: string,
  templateName: string
): Promise<EmailTemplate | null> {
  // Try to get the email template by ID first
  if (templateId) {
    const { data: dbTemplate, error } = await supabase
      .from('email_templates')
      .select('subject, body')
      .eq('id', templateId)
      .single();
      
    if (!error && dbTemplate) {
      return dbTemplate;
    }
  }
  
  // If no template found by ID, try to find by name
  const { data: dbTemplate, error } = await supabase
    .from('email_templates')
    .select('subject, body')
    .eq('name', templateName)
    .single();
    
  if (!error && dbTemplate) {
    return dbTemplate;
  }
  
  return null;
}

export function prepareVariables(request: EmailRequest): Record<string, string> {
  return {
    employeeName: request.employeeName,
    employeeEmail: request.employeeEmail,
    linkUrl: request.linkUrl,
    assessmentId: request.assessmentId,
    templateName: request.templateName,
    nome: request.employeeName, // Aliases in Portuguese
    link: request.linkUrl,
    data_limite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
  };
}

