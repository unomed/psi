import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChecklistTemplate, Employee } from "@/types";
import { EmployeeMultiSelector } from "./EmployeeMultiSelector";

interface EmailChecklistFormProps {
  templates: ChecklistTemplate[];
  onSendEmails: (data: {
    templateId: string;
    employees: any[];
    subject: string;
    body: string;
  }) => void;
}

export function EmailChecklistForm({ templates, onSendEmails }: EmailChecklistFormProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleSendEmails = () => {
    if (!selectedTemplateId || selectedEmployees.length === 0) {
      toast.error("Selecione um template e pelo menos um funcionário.");
      return;
    }

    if (!subject || !body) {
      toast.error("Por favor, preencha o assunto e o corpo do email.");
      return;
    }

    onSendEmails({
      templateId: selectedTemplateId,
      employees: selectedEmployees,
      subject: subject,
      body: body
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Avaliações por Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template">Template</Label>
          <Select onValueChange={setSelectedTemplateId}>
            <SelectTrigger id="template">
              <SelectValue placeholder="Selecione um template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Funcionários</Label>
          <EmployeeMultiSelector onEmployeesChange={setSelectedEmployees} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Assunto</Label>
          <Input
            id="subject"
            placeholder="Assunto do email"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Corpo do Email</Label>
          <Textarea
            id="body"
            placeholder="Corpo do email"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="resize-none"
          />
        </div>

        <Button onClick={handleSendEmails}>Enviar Emails</Button>
      </CardContent>
    </Card>
  );
}
