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
  
  const formattedCompanies = companies.map(company => ({
    company_id: company.id,
    ...company
  }));
  
  const accessibleCompanyRecords = filterResourcesByCompany(formattedCompanies);
  
  const accessibleCompanies = accessibleCompanyRecords
    .map(company => ({
      id: company.company_id || "",
      name: company.name || "",
    }))
    .filter(company => company && company.id && String(company.id).trim() !== "" && company.name && String(company.name).trim() !== "");

  const companyItems = accessibleCompanies || [];
  const sectorItems = (sectors || [])
    .filter(s => s && s.id && String(s.id).trim() !== "" && s.name && String(s.name).trim() !== "" && (!selectedCompany || s.companyId === selectedCompany));
  const roleItems = (roles || [])
    .filter(r => r && r.id && String(r.id).trim() !== "" && r.name && String(r.name).trim() !== "" && (!selectedCompany || r.companyId === selectedCompany));

  const statusOptions = [
    { value: "active", label: "Ativo" },
    { value: "inactive", label: "Inativo" },
    { value: "vacation", label: "Férias" },
    { value: "medical_leave", label: "Licença Médica" }
  ].filter(option => option && option.value && String(option.value).trim() !== "");
  
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
                value={field.value || "no-company-selected"}
                onValueChange={(value) => {
                  if (value !== "no-company-selected") {
                    field.onChange(value);
                    onCompanyChange(value);
                    form.setValue("sector_id", "");
                    form.setValue("role_id", "");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companyItems.length > 0 ? (
                    companyItems.map((company) => (
                        <SelectItem key={String(company.id)} value={String(company.id)}>
                          {company.name}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem value="no-companies-available" disabled>
                      Nenhuma empresa disponível
                    </SelectItem>
                  )}
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
                value={field.value || "no-sector-selected"}
                onValueChange={(value) => {
                  if (value !== "no-sector-selected") {
                    field.onChange(value);
                    onSectorChange(value);
                    form.setValue("role_id", "");
                  }
                }}
                disabled={!selectedCompany}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um setor" />
                </SelectTrigger>
                <SelectContent>
                  {sectorItems.length > 0 ? (
                    sectorItems.map((sector) => (
                        <SelectItem key={String(sector.id)} value={String(sector.id)}>
                          {sector.name}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem value="no-sectors-available" disabled>
                      {selectedCompany ? "Nenhum setor encontrado" : "Selecione uma empresa primeiro"}
                    </SelectItem>
                  )}
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
                value={field.value || "no-role-selected"}
                onValueChange={(value) => {
                  if (value !== "no-role-selected") {
                    field.onChange(value);
                  }
                }}
                disabled={!selectedCompany}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  {roleItems.length > 0 ? (
                    roleItems.map((role) => (
                        <SelectItem key={String(role.id)} value={String(role.id)}>
                          {role.name}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem value="no-roles-available" disabled>
                      {selectedCompany ? "Nenhuma função encontrada" : "Selecione uma empresa primeiro"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
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
                value={field.value || "active"}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                  ))}
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
