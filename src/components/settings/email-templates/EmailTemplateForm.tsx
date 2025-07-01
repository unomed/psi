
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TemplateTypeSelect } from "./components/TemplateTypeSelect";
import { EmailContentFields } from "./components/EmailContentFields";
import { EmailTemplateFormProps, EmailTemplateFormValues } from "./types/form";
import { 
  emailTemplateCreateSchema, 
  emailTemplateEditSchema,
  EmailTemplateCreateValues,
  EmailTemplateEditValues 
} from "./schemas/emailTemplateSchema";

export function EmailTemplateForm({ 
  mode, 
  template, 
  onSubmit,
  allowedTemplateNames = ["Convite", "Conclusão", "Lembrete"]
}: EmailTemplateFormProps) {
  const schema = mode === 'create' ? emailTemplateCreateSchema : emailTemplateEditSchema;
  
  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: mode === 'create' 
      ? { 
          name: '', 
          subject: '', 
          body: '', 
          description: '' 
        }
      : {
          subject: template?.subject || '',
          body: template?.body || ''
        }
  });

  const handleSubmit = (values: EmailTemplateCreateValues | EmailTemplateEditValues) => {
    onSubmit(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'create' 
            ? 'Criar Novo Modelo de Email' 
            : template?.name
          }
        </CardTitle>
        {mode === 'create' && (
          <CardDescription>
            Preencha os detalhes do novo modelo de email
          </CardDescription>
        )}
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            {mode === 'create' && (
              <TemplateTypeSelect 
                form={form as any} 
                allowedTemplateNames={allowedTemplateNames} 
              />
            )}
            
            <EmailContentFields form={form} mode={mode} />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === 'create' ? (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Modelo
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Template
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
