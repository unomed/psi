
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { EmailTemplate } from "./types"; // Changed import path

const emailTemplateSchema = z.object({
  subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres"),
  body: z.string().min(20, "O conteúdo deve ter pelo menos 20 caracteres")
});

type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>;

interface EmailTemplateFormProps {
  template: EmailTemplate;
  onSubmit: (values: EmailTemplateFormValues) => void;
}

export function EmailTemplateForm({ template, onSubmit }: EmailTemplateFormProps) {
  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      subject: template.subject,
      body: template.body
    },
    values: {
      subject: template.subject,
      body: template.body
    }
  });

  return (
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
  );
}
