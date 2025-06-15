
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmployeeTypeAndTagsFieldsProps {
  form: any;
  selectedRole: string | null;
  requiredTags: string[];
}

export function EmployeeTypeAndTagsFields({ 
  form
}: EmployeeTypeAndTagsFieldsProps) {
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium">Tipo de Funcionário</h3>
      
      <FormField
        control={form.control}
        name="employee_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Pessoa</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidato">Candidato (Entrevista)</SelectItem>
                  <SelectItem value="funcionario">Funcionário (Ativo)</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
