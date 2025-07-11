import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, AlertCircle, Eye, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChecklistTemplate } from "@/types/checklist";
import { EmployeeMultiSelector } from "./EmployeeMultiSelector";
import { EmailPreview } from "./EmailPreview";
import { toast } from "sonner";
import type { Employee } from "@/types/employee";

// Interface local para garantir que o email seja obrigatório no contexto de envio de emails
interface EmailEmployee extends Employee {
  email: string; // Tornando o email obrigatório neste contexto
}

interface EmailChecklistFormProps {
  templates: ChecklistTemplate[];
  onSendEmails: (data: {
    templateId: string;
    employees: EmailEmployee[];
    subject: string;
    body: string;
    scheduledDate: Date;
  }) => Promise<void>;
  companyId?: string;
}

const defaultEmailBody = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🏢 Convite para Avaliação</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;"><strong>{{companyName}}</strong></p>
    <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">Programa de Saúde e Bem-estar</p>
  </div>
  
  <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 18px; margin-bottom: 20px;">Prezado(a) <strong>{{employeeName}}</strong>,</p>
    
    <p style="margin-bottom: 20px;">Você foi convidado(a) pela <strong>{{companyName}}</strong> a participar de uma avaliação <strong>{{templateName}}</strong> como parte do programa de saúde e bem-estar da empresa.</p>
    
    <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
      <h3 style="margin-top: 0; color: #2563eb; font-size: 18px;">🔗 Acesse sua avaliação:</h3>
      <a href="{{linkUrl}}" style="display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">🚀 Responder Avaliação</a>
    </div>
    
    <div style="background-color: #ecfdf5; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #10b981;">
      <h3 style="margin-top: 0; color: #047857; font-size: 16px;">📋 Informações importantes:</h3>
      <ul style="margin-bottom: 0; color: #047857;">
        <li>A avaliação é confidencial e os dados são protegidos pela LGPD</li>
        <li>Tempo estimado: 15-20 minutos</li>
        <li>Prazo para conclusão: 7 dias</li>
        <li>Em caso de dúvidas, entre em contato com o RH da {{companyName}}</li>
      </ul>
    </div>
    
    <p style="margin: 30px 0 20px 0;">Sua participação é fundamental para promovermos um ambiente de trabalho mais saudável e produtivo na <strong>{{companyName}}</strong>.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        Atenciosamente,<br>
        <strong style="color: #374151;">Equipe de Recursos Humanos - {{companyName}}</strong>
      </p>
    </div>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
    <p style="margin: 0;">Este é um email automático da {{companyName}}. Por favor, não responda a este email.</p>
  </div>
</div>
`;

export function EmailChecklistForm({ templates, onSendEmails, companyId }: EmailChecklistFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(defaultEmailBody);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(`{{companyName}} - Convite para Avaliação: ${template.title}`);
    }
  };

  const handleSend = async () => {
    if (!selectedTemplate || selectedEmployees.length === 0 || !subject.trim() || !body.trim() || !scheduledDate) {
      toast.error("Preencha todos os campos obrigatórios, incluindo a data de agendamento");
      return;
    }

    // Filtra apenas funcionários com email válido
    const employeesWithEmail = selectedEmployees.filter(emp => emp.email && emp.email.trim() !== "") as EmailEmployee[];
    
    if (employeesWithEmail.length === 0) {
      toast.error("Nenhum funcionário selecionado possui email válido");
      return;
    }

    if (employeesWithEmail.length < selectedEmployees.length) {
      toast.warning(`${selectedEmployees.length - employeesWithEmail.length} funcionário(s) não possuem email e serão ignorados`);
    }

    setIsLoading(true);
    try {
      await onSendEmails({
        templateId: selectedTemplate,
        employees: employeesWithEmail,
        subject,
        body,
        scheduledDate
      });
      
      // Reset form
      setSelectedTemplate("");
      setSelectedEmployees([]);
      setSubject("");
      setBody(defaultEmailBody);
      setScheduledDate(undefined);
      setShowPreview(false);
      
      toast.success(`Emails enviados para ${selectedEmployees.length} funcionário(s)!`);
    } catch (error) {
      console.error("Erro ao enviar emails:", error);
      toast.error("Erro ao enviar emails. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Enviar Checklist por Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template-select">Template de Checklist *</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title} ({template.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Selection */}
          <EmployeeMultiSelector
            selectedEmployees={selectedEmployees}
            onSelectionChange={setSelectedEmployees}
            companyId={companyId}
          />

          {/* Email Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto do Email *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: {{companyName}} - Convite para Avaliação Psicossocial"
            />
            <div className="text-xs text-muted-foreground">
              Use <code>{'{{companyName}}'}</code> para incluir o nome da empresa automaticamente
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Corpo do Email *</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Digite o conteúdo do email..."
              className="font-mono text-sm"
            />
            <div className="text-xs text-muted-foreground">
              Variáveis disponíveis: <code>{'{{employeeName}}'}</code>, <code>{'{{templateName}}'}</code>, <code>{'{{linkUrl}}'}</code>, <code>{'{{companyName}}'}</code>
            </div>
          </div>

          {/* Data de Agendamento */}
          <div className="space-y-2">
            <Label htmlFor="scheduled-date">Data de Agendamento *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="scheduled-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduledDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "dd/MM/yyyy") : "Selecionar data de agendamento"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="text-xs text-muted-foreground">
              Selecione a data para agendar as avaliações
            </div>
          </div>

          {/* Validation Alert */}
          {(!selectedTemplate || selectedEmployees.length === 0 || !scheduledDate) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Selecione um template, pelo menos um funcionário e uma data de agendamento para continuar.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              disabled={!selectedTemplate || selectedEmployees.length === 0 || !scheduledDate}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "Ocultar" : "Visualizar"} Preview
            </Button>
            
            <Button
              onClick={handleSend}
              disabled={!selectedTemplate || selectedEmployees.length === 0 || !subject.trim() || !body.trim() || !scheduledDate || isLoading}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? "Enviando..." : `Enviar para ${selectedEmployees.length} funcionário(s)`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Preview */}
      {showPreview && selectedTemplate && selectedEmployees.length > 0 && (
        <EmailPreview
          subject={subject}
          body={body}
          employeeName={selectedEmployees[0].name}
          employeeEmail={selectedEmployees[0].email || ""}
          templateName={selectedTemplateData?.title || ""}
          linkUrl="[Link será gerado automaticamente]"
          companyName="[Nome da Empresa]"
        />
      )}
    </div>
  );
}
