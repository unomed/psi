
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail, FilePlus, Save } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define types for email templates
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  description: string;
}

// Mock email templates for now
const initialTemplates: EmailTemplate[] = [
  {
    id: "assessment-invitation",
    name: "Convite para Avaliação",
    subject: "Convite para participar de uma avaliação psicossocial",
    body: `Olá {nome},

Você foi convidado(a) a participar de uma avaliação psicossocial. 
Por favor, acesse o link abaixo para completar a avaliação até {data_limite}.

Link da avaliação: {link}

Se tiver qualquer dúvida, entre em contato com o RH.

Atenciosamente,
Equipe de Recursos Humanos`,
    description: "Enviado quando uma nova avaliação é agendada para um funcionário"
  },
  {
    id: "assessment-reminder",
    name: "Lembrete de Avaliação",
    subject: "Lembrete: Avaliação psicossocial pendente",
    body: `Olá {nome},

Este é um lembrete de que você tem uma avaliação psicossocial pendente que precisa ser concluída até {data_limite}.

Link da avaliação: {link}

A sua participação é muito importante.

Atenciosamente,
Equipe de Recursos Humanos`,
    description: "Enviado como lembrete para funcionários com avaliações pendentes"
  },
];

const emailTemplateSchema = z.object({
  subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres"),
  body: z.string().min(20, "O conteúdo deve ter pelo menos 20 caracteres")
});

type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>;

export default function EmailTemplateSettings() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [activeTemplate, setActiveTemplate] = useState<string>(templates[0].id);

  // Get the currently active template
  const currentTemplate = templates.find(t => t.id === activeTemplate) || templates[0];

  // Setup form with the current template values
  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      subject: currentTemplate.subject,
      body: currentTemplate.body
    },
    values: {
      subject: currentTemplate.subject,
      body: currentTemplate.body
    }
  });

  // Update form values when template changes
  React.useEffect(() => {
    form.reset({
      subject: currentTemplate.subject,
      body: currentTemplate.body
    });
  }, [currentTemplate, form]);

  const onSubmit = (values: EmailTemplateFormValues) => {
    // Update the template in state
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
    
    // In a real app, this would save to a database
    toast({
      title: "Template salvo",
      description: "Seu modelo de email foi atualizado com sucesso.",
    });
  };

  const handleCreateTemplate = () => {
    // This would open a dialog to create a new template in a real app
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
            <Card>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assunto do Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Assunto do email..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="body"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conteúdo do Email</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Digite o conteúdo do email..." 
                              className="min-h-[300px] font-mono" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Você pode usar as seguintes variáveis: {"{nome}"}, {"{link}"}, {"{data_limite}"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Template
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
