
import { useEffect, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";
import { useRoles } from "@/hooks/useRoles";
import { useCompanyAccessCheck } from "@/hooks/useCompanyAccessCheck";
import { DatePicker } from "@/components/ui/date-picker";
import { isValidDate } from "@/utils/dateUtils";

interface EmploymentFieldsProps {
  form: any;
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
  const { companies } = useCompanies();
  const { sectors } = useSectors();
  const { roles } = useRoles();
  const { filterResourcesByCompany } = useCompanyAccessCheck();
  
  // Convert companies to the format expected by filterResourcesByCompany
  const formattedCompanies = companies.map(company => ({
    company_id: company.id,
    ...company
  }));
  
  // Filter companies based on user access
  const accessibleCompanyRecords = filterResourcesByCompany(formattedCompanies);
  
  // Convert back to the format expected by the UI
  const accessibleCompanies = accessibleCompanyRecords.map(company => ({
    id: company.company_id || "",
    name: company.name || "",
    // ...other properties
  }));

  // Make sure we use empty arrays when data is undefined
  const companyItems = accessibleCompanies || [];
  const sectorItems = sectors?.filter(s => !selectedCompany || s.companyId === selectedCompany) || [];
  const roleItems = roles?.filter(r => !selectedCompany || r.companyId === selectedCompany) || [];
  
  // Set company_id when form loads if it's not set
  useEffect(() => {
    if (selectedCompany && !form.getValues("company_id")) {
      form.setValue("company_id", selectedCompany);
    }
  }, [form, selectedCompany]);
  
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium">Informações Profissionais</h3>
      
      <FormField
        control={form.control}
        name="company_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Empresa</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  onCompanyChange(value);
                  
                  // Clear sector and role when company changes
                  form.setValue("sector_id", "");
                  form.setValue("role_id", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companyItems.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="sector_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Setor</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  onSectorChange(value);
                  
                  // Clear role when sector changes
                  form.setValue("role_id", "");
                }}
                disabled={!selectedCompany}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um setor" />
                </SelectTrigger>
                <SelectContent>
                  {sectorItems.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="role_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Função</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!selectedCompany}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  {roleItems.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Admissão</FormLabel>
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
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="vacation">Férias</SelectItem>
                  <SelectItem value="medical_leave">Licença Médica</SelectItem>
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
