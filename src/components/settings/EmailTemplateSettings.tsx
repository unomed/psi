
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EmailTemplateForm } from "./email-templates/EmailTemplateForm";
import { EmailTemplate } from "./email-templates/types";
import { initialTemplates } from "./email-templates/mockData";

export default function EmailTemplateSettings() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [activeTemplate, setActiveTemplate] = useState<string>(templates[0].id);

  const currentTemplate = templates.find(t => t.id === activeTemplate) || templates[0];

  const handleSubmit = (values: { subject: string; body: string }) => {
    const updatedTemplates = templates.map(template => {
      if (template.id === activeTemplate) {
        return {
          ...template,
          subject: values.subject,
          body: values.body
        };
      }
      return template;
    });

    setTemplates(updatedTemplates);
    toast({
      title: "Template salvo",
      description: "Seu modelo de email foi atualizado com sucesso.",
    });
  };

  const handleCreateTemplate = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "A criação de novos modelos estará disponível em breve.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Modelos de Email</h2>
        <Button onClick={handleCreateTemplate} variant="outline" size="sm">
          <FilePlus className="mr-2 h-4 w-4" />
          Novo Modelo
        </Button>
      </div>

      <Tabs
        value={activeTemplate} 
        onValueChange={setActiveTemplate}
        className="w-full"
      >
        <TabsList className="mb-4">
          {templates.map((template) => (
            <TabsTrigger key={template.id} value={template.id}>
              {template.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {templates.map((template) => (
          <TabsContent key={template.id} value={template.id}>
            <EmailTemplateForm 
              template={template} 
              onSubmit={handleSubmit}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
