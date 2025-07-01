
import { supabase } from "@/integrations/supabase/client";

interface TestEmailParams {
  recipient: string;
  subject: string;
  body: string;
  smtpSettings?: {
    server: string;
    port: number;
    username: string;
    password: string;
    senderEmail: string;
    senderName: string;
  };
}

export async function sendTestEmail(params: TestEmailParams) {
  try {
    const { data, error } = await supabase.functions.invoke('send-test-email', {
      body: params
    });

    if (error) {
      console.error('Error sending test email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in sendTestEmail service:', error);
    throw error;
  }
}

export async function validateEmailConfiguration() {
  try {
    const { data, error } = await supabase.functions.invoke('validate-email-config', {
      body: {}
    });

    if (error) {
      console.error('Error validating email configuration:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in validateEmailConfiguration service:', error);
    throw error;
  }
}
