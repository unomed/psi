
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, Calendar, Building } from "lucide-react";
import { EmailTemplate } from "@/types";

interface EmailPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate | null;
  sampleData?: {
    employee_name?: string;
    employee_email?: string;
    company_name?: string;
    assessment_title?: string;
    assessment_link?: string;
    due_date?: string;
    manager_name?: string;
    sector_name?: string;
    risk_level?: string;
    completion_date?: string;
  };
}

export function EmailPreviewDialog({ 
  isOpen, 
  onClose, 
  template,
  sampleData = {
    employee_name: "João Silva",
    employee_email: "joao.silva@empresa.com",
    company_name: "Empresa Exemplo LTDA",
    assessment_title: "Avaliação Psicossocial Anual",
    assessment_link: "https://app.exemplo.com/avaliacao/abc123",
    due_date: "30/12/2024",
    manager_name: "Maria Santos",
    sector_name: "Recursos Humanos",
    risk_level: "Médio",
    completion_date: "15/12/2024"
  }
}: EmailPreviewDialogProps) {
  
  const processTemplate = (text: string) => {
    let processed = text;
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, value);
    });
    return processed;
  };

  const processedSubject = template ? processTemplate(template.subject) : "";
  const processedBody = template ? processTemplate(template.body) : "";

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prévia do Template: {template.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Email Header Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Informações do Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">De:</span>
                  <span>{sampleData.company_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Para:</span>
                  <span>{sampleData.employee_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Setor:</span>
                  <span>{sampleData.sector_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Data Limite:</span>
                  <span>{sampleData.due_date}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conteúdo do Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Assunto:</span>
                <p className="font-medium mt-1">{processedSubject}</p>
              </div>

              {/* Body */}
              <div className="p-4 border rounded-lg bg-background">
                <div className="prose prose-sm max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: processedBody.replace(/\n/g, '<br>') 
                    }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Data Used */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados de Exemplo Utilizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {Object.entries(sampleData).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-mono text-xs">{`{{${key}}}`}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
