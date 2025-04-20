
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useEmailServerSettings } from "@/hooks/settings/useEmailServerSettings";
import { EmailServerFormFields } from "./email-server/components/EmailServerFormFields";
import { EmailServerFormActions } from "./email-server/components/EmailServerFormActions";
import { EmailSettingsLoading } from "./email-server/components/EmailSettingsLoading";
import { emailServerSchema, type EmailServerFormValues } from "./email-server/schemas/emailServerSchema";

export default function EmailServerSettings() {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { 
    settings, 
    isLoading, 
    isUpdating, 
    updateSettings, 
    testConnection 
  } = useEmailServerSettings();

  const form = useForm<EmailServerFormValues>({
    resolver: zodResolver(emailServerSchema),
    values: {
      smtpServer: settings?.smtp_server || "",
      smtpPort: settings?.smtp_port?.toString() || "587",
      username: settings?.username || "",
      password: settings?.password || "",
      senderEmail: settings?.sender_email || "",
      senderName: settings?.sender_name || ""
    },
    defaultValues: {
      smtpServer: "",
      smtpPort: "587",
      username: "",
      password: "",
      senderEmail: "",
      senderName: ""
    }
  });

  if (isLoading) {
    return <EmailSettingsLoading />;
  }

  const onSubmit = (data: EmailServerFormValues) => {
    updateSettings({
      smtp_server: data.smtpServer,
      smtp_port: parseInt(data.smtpPort),
      username: data.username,
      password: data.password,
      sender_email: data.senderEmail,
      sender_name: data.senderName
    });
  };

  const handleTestConnection = async () => {
    try {
      setIsTestingConnection(true);
      const success = await testConnection();
      if (success) {
        toast.success("Conexão bem sucedida", {
          description: "O servidor de email está configurado corretamente."
        });
      } else {
        toast.error("Erro ao testar conexão", {
          description: "Não foi possível conectar ao servidor de email. Verifique as configurações."
        });
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error("Erro ao testar conexão", {
        description: error instanceof Error ? error.message : "Não foi possível conectar ao servidor de email. Verifique as configurações."
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Servidor de Email</CardTitle>
        <CardDescription>
          Configure as informações do servidor SMTP para envio de emails
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <EmailServerFormFields form={form} />
            <EmailServerFormActions
              isUpdating={isUpdating}
              isTestingConnection={isTestingConnection}
              onTestConnection={handleTestConnection}
              hasSettings={!!settings}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
