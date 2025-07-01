
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormSchema } from "../schemas/employeeFormSchema";

interface AdditionalFieldsProps {
  form: UseFormReturn<EmployeeFormSchema>;
}

export function AdditionalFields({ form }: AdditionalFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Textarea {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="special_conditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condições especiais</FormLabel>
            <FormControl>
              <Textarea {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
