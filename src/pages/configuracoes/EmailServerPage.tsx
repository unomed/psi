
import EmailServerSettings from "@/components/settings/EmailServerSettings";

export default function EmailServerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Servidor de Email</h1>
        <p className="text-muted-foreground mt-2">
          Configure as informações do servidor SMTP para envio de emails.
        </p>
      </div>
      <EmailServerSettings />
    </div>
  );
}
