import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmailTemplateForm } from "./email-templates/EmailTemplateForm";
import { useEmailTemplates } from "@/hooks/settings/useEmailTemplates";
import { Skeleton } from "@/components/ui/skeleton";

// Mapa para tradução dos IDs dos templates para nomes em português
const templateNameMap: Record<string, string> = {
  "completion": "Conclusão",
  "reminder": "Lembrete",
  "welcome": "Convite"
};

export default function EmailTemplateSettings() {
  const { templates = [], isLoading, updateTemplate, createTemplate } = useEmailTemplates();
  const [activeTemplate, setActiveTemplate] = React.useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (templates.length > 0 && !activeTemplate) {
      setActiveTemplate(templates[0].id);
    }
  }, [templates, activeTemplate]);

  const currentTemplate = templates.find(t => t.id === activeTemplate);

  const handleSubmit = (values: { subject: string; body: string }) => {
    if (!currentTemplate) return;
    
    updateTemplate({
      id: currentTemplate.id,
      subject: values.subject,
      body: values.body
    });
  };

  const handleCreateTemplate = (templateData: { 
    name: string; 
    subject: string; 
    body: string; 
    description?: string 
  }) => {
    createTemplate(templateData);
    setIsCreateDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Modelos de E-mail</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FilePlus className="mr-2 h-4 w-4" />
              Novo Modelo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Modelo de E-mail</DialogTitle>
            </DialogHeader>
            <EmailTemplateForm 
              mode="create"
              onSubmit={handleCreateTemplate} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {templates.length > 0 ? (
        <Tabs
          value={activeTemplate}
          onValueChange={setActiveTemplate}
          className="w-full"
        >
          <TabsList className="mb-4">
            {templates.map((template) => (
              <TabsTrigger key={template.id} value={template.id}>
                {templateNameMap[template.id] || template.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {templates.map((template) => (
            <TabsContent key={template.id} value={template.id}>
              <EmailTemplateForm
                mode="edit"
                template={{
                  ...template,
                  description: template.description || ''
                }}
                onSubmit={handleSubmit}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum modelo de email encontrado.
        </div>
      )}
    </div>
  );
}
