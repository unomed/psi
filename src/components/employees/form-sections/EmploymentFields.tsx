
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormSchema } from "../schemas/employeeFormSchema";
import { CompanySelector } from "@/components/assessments/selectors/CompanySelector";
import { SectorSelector } from "@/components/assessments/selectors/SectorSelector";
import { RoleSelector } from "@/components/assessments/selectors/RoleSelector";

interface EmploymentFieldsProps {
  form: UseFormReturn<EmployeeFormSchema>;
  selectedCompany: string | null;
  selectedSector: string | null;
  onCompanyChange: (value: string) => void;
  onSectorChange: (value: string) => void;
}

export function EmploymentFields({ 
  form, 
  selectedCompany, 
  selectedSector, 
  onCompanyChange, 
  onSectorChange 
}: EmploymentFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de admissão</FormLabel>
            <FormControl>
              <DatePicker
                date={field.value}
                onSelect={field.onChange}
                allowInput={true}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="vacation">Férias</SelectItem>
                <SelectItem value="medical_leave">Licença médica</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="company_id"
          render={({ field }) => (
            <FormItem>
              <CompanySelector
                selectedCompany={selectedCompany}
                onCompanyChange={(value) => {
                  onCompanyChange(value);
                  field.onChange(value);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sector_id"
          render={({ field }) => (
            <FormItem>
              <SectorSelector
                selectedCompany={selectedCompany}
                selectedSector={selectedSector}
                onSectorChange={(value) => {
                  onSectorChange(value);
                  field.onChange(value);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role_id"
          render={({ field }) => (
            <FormItem>
              <RoleSelector
                selectedSector={selectedSector}
                selectedRole={field.value}
                onRoleChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
