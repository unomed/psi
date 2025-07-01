
import EmailTemplateSettings from "@/components/settings/EmailTemplateSettings";

export default function EmailTemplatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">E-mails</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os modelos de email utilizados no sistema.
        </p>
      </div>
      <EmailTemplateSettings />
    </div>
  );
}
