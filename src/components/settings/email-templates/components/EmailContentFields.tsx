
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { EmailTemplateFormValues } from "../types/form";

interface EmailContentFieldsProps {
  form: UseFormReturn<EmailTemplateFormValues>;
  mode: 'create' | 'edit';
}

export function EmailContentFields({ form, mode }: EmailContentFieldsProps) {
  return (
    <>
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
    </>
  );
}
