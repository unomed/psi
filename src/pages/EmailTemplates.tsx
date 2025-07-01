
import { EmailTemplateSection } from "@/components/assessment-scheduling/email-templates/EmailTemplateSection";

export default function EmailTemplates() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Templates de Email</h1>
        <p className="text-muted-foreground">
          Configure templates personalizados para comunicação automatizada em avaliações psicossociais
        </p>
      </div>

      <EmailTemplateSection />
    </div>
  );
}
