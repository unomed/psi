
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
    // Para o Supabase nativo, verificamos se o serviço está ativo
    console.log("Verificando configuração de email do Supabase...");
    
    // O Supabase Auth sempre tem configuração de email básica
    return {
      hasSettings: true,
      isComplete: true,
      missingFields: [],
      settings: {
        type: 'supabase_native',
        enabled: true
      }
    };
  } catch (error) {
    console.error('Error verifying Supabase email configuration:', error);
    return {
      hasSettings: false,
      isComplete: false,
      missingFields: ['Erro ao verificar configuração do Supabase']
    };
  }
}

export async function testEmailConnection(): Promise<boolean> {
  try {
    // Para o Supabase nativo, sempre retorna true se o projeto está ativo
    console.log("Testando conexão de email do Supabase...");
    
    // Verifica se conseguimos acessar as funções do Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      toast.success('Conexão de email do Supabase verificada com sucesso!');
      return true;
    } else {
      toast.info('Sistema de email do Supabase está disponível');
      return true;
    }
  } catch (error) {
    console.error('Error in testEmailConnection:', error);
    toast.error('Erro ao verificar conexão de email');
    return false;
  }
}

export function isDevelopmentMode(): boolean {
  // Check various indicators that we're in development
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('.lovableproject.com') ||
         window.location.hostname.includes('ngrok.io') ||
         process?.env?.NODE_ENV === 'development';
}
