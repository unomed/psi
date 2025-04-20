
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Save, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmailTemplate } from "./types";

interface EmailTemplateFormProps {
  mode: 'create' | 'edit';
  template?: EmailTemplate;
  onSubmit: (values: any) => void;
  allowedTemplateNames?: string[];
}

export function EmailTemplateForm({ 
  mode, 
  template, 
  onSubmit,
  allowedTemplateNames = ["Convite", "Conclusão", "Lembrete"]
}: EmailTemplateFormProps) {
  // Define schemas based on mode
  const emailTemplateCreateSchema = z.object({
    name: z.string().min(1, "O tipo de modelo é obrigatório"),
    subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres"),
    body: z.string().min(20, "O conteúdo deve ter pelo menos 20 caracteres"),
    description: z.string().optional()
  });

  const emailTemplateEditSchema = z.object({
    subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres"),
    body: z.string().min(20, "O conteúdo deve ter pelo menos 20 caracteres")
  });
  
  const schema = mode === 'create' ? emailTemplateCreateSchema : emailTemplateEditSchema;
  
  const form = useForm({
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

  const handleSubmit = (values: any) => {
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Modelo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo do modelo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allowedTemplateNames.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Escolha o tipo de modelo que deseja criar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
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

            {mode === 'create' && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Breve descrição do modelo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
