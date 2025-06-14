
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmailConfigStatus {
  hasSettings: boolean;
  isComplete: boolean;
  missingFields: string[];
  settings?: any;
}

export async function verifyEmailConfiguration(): Promise<EmailConfigStatus> {
  try {
    const { data: settings, error } = await supabase
      .from('email_server_settings')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching email settings:', error);
      toast.error('Erro ao verificar configurações de email');
      return {
        hasSettings: false,
        isComplete: false,
        missingFields: ['Erro ao acessar configurações']
      };
    }

    if (!settings) {
      return {
        hasSettings: false,
        isComplete: false,
        missingFields: ['Nenhuma configuração encontrada']
      };
    }

    const requiredFields = [
      { field: 'smtp_server', name: 'Servidor SMTP' },
      { field: 'smtp_port', name: 'Porta SMTP' },
      { field: 'username', name: 'Usuário' },
      { field: 'password', name: 'Senha' },
      { field: 'sender_email', name: 'Email do remetente' }
    ];

    const missingFields = requiredFields
      .filter(({ field }) => !settings[field])
      .map(({ name }) => name);

    return {
      hasSettings: true,
      isComplete: missingFields.length === 0,
      missingFields,
      settings
    };
  } catch (error) {
    console.error('Error verifying email configuration:', error);
    return {
      hasSettings: false,
      isComplete: false,
      missingFields: ['Erro inesperado']
    };
  }
}

export async function testEmailConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('test-email-connection');
    
    if (error) {
      console.error('Error testing email connection:', error);
      toast.error('Erro ao testar conexão de email');
      return false;
    }

    if (data?.success) {
      toast.success('Conexão de email testada com sucesso!');
      return true;
    } else {
      toast.error('Falha na conexão de email');
      return false;
    }
  } catch (error) {
    console.error('Error in testEmailConnection:', error);
    toast.error('Erro ao testar conexão');
    return false;
  }
}
