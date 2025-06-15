
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmployeeTagsSelector } from "./EmployeeTagsSelector";

interface EmployeeTypeAndTagsFieldsProps {
  form: any;
  selectedRole: string | null;
  requiredTags: string[];
  employeeId?: string;
}

export function EmployeeTypeAndTagsFields({ 
  form,
  selectedRole,
  requiredTags,
  employeeId
}: EmployeeTypeAndTagsFieldsProps) {
  const employeeType = form.watch("employee_type");

  return (
    <div className="space-y-6">
      <div className="space-y-4 border p-4 rounded-md">
        <h3 className="text-lg font-medium">Tipo de Pessoa</h3>
        
        <FormField
          control={form.control}
          name="employee_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
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

      {/* Tags Section */}
      <EmployeeTagsSelector 
        employeeId={employeeId}
        selectedRole={selectedRole}
        employeeType={employeeType}
        onTagsChange={(tags) => {
          form.setValue("employee_tags", tags);
        }}
      />
    </div>
  );
}
