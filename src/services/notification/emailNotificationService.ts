
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function sendAssessmentEmail({
  employeeId,
  employeeName,
  employeeEmail,
  assessmentId,
  templateId,
  templateName,
  linkUrl,
  customSubject,
  customBody
}: {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  assessmentId: string;
  templateId?: string;
  templateName: string;
  linkUrl: string;
  customSubject?: string;
  customBody?: string;
}) {
  try {
    const { data, error } = await supabase.functions.invoke('send-assessment-email', {
      body: {
        employeeId,
        employeeName,
        employeeEmail,
        assessmentId,
        templateId,
        templateName,
        linkUrl,
        customSubject,
        customBody
      }
    });

    if (error) {
      console.error('Error sending assessment email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in sendAssessmentEmail:', error);
    toast.error('Erro ao enviar email de avaliação');
    throw error;
  }
}

export async function getActiveEmailServerSettings() {
  try {
    const { data, error } = await supabase
      .from('email_server_settings')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching email server settings:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getActiveEmailServerSettings:', error);
    throw error;
  }
}

export async function getEmailTemplate(templateName: string) {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', templateName)
      .maybeSingle();

    if (error) {
      console.error('Error fetching email template:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getEmailTemplate:', error);
    throw error;
  }
}
