
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EmailTemplateCreateValues } from "../schemas/emailTemplateSchema";

interface TemplateTypeSelectProps {
  form: UseFormReturn<EmailTemplateCreateValues>;
  allowedTemplateNames: string[];
}

export function TemplateTypeSelect({ form, allowedTemplateNames }: TemplateTypeSelectProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Modelo</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo do modelo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {allowedTemplateNames.map((name) => {
                if (!name || name.trim() === '') {
                  console.error('Empty template name detected in TemplateTypeSelect:', name);
                  return null;
                }
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              }).filter(Boolean)}
            </SelectContent>
          </Select>
          <FormDescription>
            Escolha o tipo de modelo que deseja criar
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
