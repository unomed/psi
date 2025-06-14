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
            value={field.value || undefined} // Use undefined for placeholder to show correctly
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo do modelo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {(allowedTemplateNames || []) // Ensure allowedTemplateNames is an array
                .filter(name => name && String(name).trim() !== "") // Filter out empty or invalid names
                .map((name) => {
                  // const nameStr = String(name); // Already done by filter effectively
                  // if (nameStr.trim() === '') { // This check is now redundant due to filter
                  //   console.error('Empty template name detected in TemplateTypeSelect:', name);
                  //   return null;
                  // }
                  return (
                    <SelectItem key={name} value={name}> {/* Name is guaranteed non-empty string */}
                      {name}
                    </SelectItem>
                  );
                })}
              {(!allowedTemplateNames || allowedTemplateNames.filter(name => name && String(name).trim() !== "").length === 0) && (
                <SelectItem value="no-template-types-available" disabled>
                  Nenhum tipo de modelo disponível
                </SelectItem>
              )}
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
