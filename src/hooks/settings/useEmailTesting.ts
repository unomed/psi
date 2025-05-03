
import { useState } from "react";
import { toast } from "sonner";
import { sendTestEmail } from "@/services/email/testEmailService";

export function useEmailTesting() {
  const [isSending, setIsSending] = useState(false);

  const sendTest = async (
    recipient: string, 
    subject: string, 
    body: string,
    smtpSettings?: {
      server: string;
      port: number;
      username: string;
      password: string;
      senderEmail: string;
      senderName: string;
    }
  ) => {
    if (!recipient) {
      toast.error("Por favor, informe um email destinatário para o teste");
      return false;
    }

    try {
      setIsSending(true);
      await sendTestEmail({
        recipient,
        subject,
        body,
        smtpSettings
      });
      
      toast.success("Email de teste enviado com sucesso", {
        description: `Um email foi enviado para ${recipient}`
      });
      return true;
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Erro ao enviar email de teste", {
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar enviar o email"
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSending,
    sendTest
  };
}
