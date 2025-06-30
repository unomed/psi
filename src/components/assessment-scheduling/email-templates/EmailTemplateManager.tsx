import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Plus, Edit, Trash2, Copy, Eye } from "lucide-react";
import { EmailTemplate } from "@/types";
import { toast } from "sonner";

interface EmailTemplateManagerProps {
  templates: EmailTemplate[];
  onCreateTemplate: (template: Omit<EmailTemplate, "id">) => void;
  onUpdateTemplate: (template: EmailTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onPreviewTemplate: (template: EmailTemplate) => void;
}

const TEMPLATE_TYPES = [
  { value: "initial_invite", label: "Convite Inicial" },
  { value: "reminder_3_days", label: "Lembrete 3 Dias" },
  { value: "reminder_1_day", label: "Lembrete 1 Dia" },
  { value: "final_reminder", label: "Lembrete Final" },
  { value: "completion_confirmation", label: "Confirmação de Conclusão" },
  { value: "high_risk_alert", label: "Alerta de Alto Risco" },
  { value: "manager_notification", label: "Notificação para Gestor" },
  { value: "action_plan_created", label: "Plano de Ação Criado" }
] as const;

type TemplateType = typeof TEMPLATE_TYPES[number]['value'];

const VARIABLE_TAGS = [
  { tag: "{{employee_name}}", description: "Nome do funcionário" },
  { tag: "{{employee_email}}", description: "Email do funcionário" },
  { tag: "{{company_name}}", description: "Nome da empresa" },
  { tag: "{{assessment_title}}", description: "Título da avaliação" },
  { tag: "{{assessment_link}}", description: "Link da avaliação" },
  { tag: "{{due_date}}", description: "Data limite" },
  { tag: "{{manager_name}}", description: "Nome do gestor" },
  { tag: "{{sector_name}}", description: "Nome do setor" },
  { tag: "{{risk_level}}", description: "Nível de risco" },
  { tag: "{{completion_date}}", description: "Data de conclusão" }
];

export function EmailTemplateManager({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onPreviewTemplate
}: EmailTemplateManagerProps) {
  const [activeTab, setActiveTab] = useState("list");
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    type: "" as string,
    description: ""
  });

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      subject: "",
      body: "",
      type: "",
      description: ""
    });
    setActiveTab("form");
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      type: template.type || "",
      description: template.description || ""
    });
    setActiveTab("form");
  };

  const handleSave = () => {
    if (!formData.name || !formData.subject || !formData.body) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const templateData = {
      name: formData.name,
      subject: formData.subject,
      body: formData.body,
      type: formData.type,
      description: formData.description
    };

    if (editingTemplate) {
      onUpdateTemplate({ ...editingTemplate, ...templateData });
      toast.success("Template atualizado com sucesso!");
    } else {
      onCreateTemplate(templateData);
      toast.success("Template criado com sucesso!");
    }

    setActiveTab("list");
  };

  const handleDuplicate = (template: EmailTemplate) => {
    setEditingTemplate(null);
    setFormData({
      name: `Cópia de ${template.name}`,
      subject: template.subject,
      body: template.body,
      type: template.type || "",
      description: template.description || ""
    });
    setActiveTab("form");
  };

  const insertVariable = (tag: string) => {
    const textarea = document.getElementById("template-body") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + tag + after;
      
      setFormData(prev => ({ ...prev, body: newText }));
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    }
  };

  const getTemplateTypeLabel = (type: string) => {
    return TEMPLATE_TYPES.find(t => t.value === type)?.label || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gerenciar Templates de Email</h3>
          <p className="text-muted-foreground">
            Crie e gerencie templates personalizados para diferentes tipos de comunicação
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Templates</TabsTrigger>
          <TabsTrigger value="form">
            {editingTemplate ? "Editar" : "Criar"} Template
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {templates.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum template encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Crie seu primeiro template de email para começar
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {templates.map(template => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        {template.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {template.type && (
                            <Badge variant="outline">
                              {getTemplateTypeLabel(template.type)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onPreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDuplicate(template)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Assunto: </span>
                        <span className="text-sm">{template.subject}</span>
                      </div>
                      <div>
                        <span className="font-medium">Prévia: </span>
                        <span className="text-sm text-muted-foreground">
                          {template.body.substring(0, 100)}...
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingTemplate ? "Editar" : "Criar"} Template de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Nome do Template *</Label>
                  <Input
                    id="template-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Convite para Avaliação"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-type">Tipo de Template</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Descrição</Label>
                <Input
                  id="template-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do template"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-subject">Assunto do Email *</Label>
                <Input
                  id="template-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Ex: Avaliação Psicossocial - {{employee_name}}"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-2">
                  <Label htmlFor="template-body">Corpo do Email *</Label>
                  <Textarea
                    id="template-body"
                    value={formData.body}
                    onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="Escreva o conteúdo do email aqui..."
                    rows={12}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Variáveis Disponíveis</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {VARIABLE_TAGS.map(variable => (
                      <div 
                        key={variable.tag}
                        className="p-2 border rounded cursor-pointer hover:bg-muted"
                        onClick={() => insertVariable(variable.tag)}
                      >
                        <code className="text-xs font-mono">{variable.tag}</code>
                        <p className="text-xs text-muted-foreground mt-1">
                          {variable.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  {editingTemplate ? "Atualizar" : "Criar"} Template
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("list")}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
