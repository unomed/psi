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
  
  // Convert back to the format expected by the UI and ensure valid data
  const accessibleCompanies = accessibleCompanyRecords
    .map(company => ({
      id: company.company_id || "",
      name: company.name || "",
    }))
    .filter(company => company.id && company.id.trim() !== "" && company.name && company.name.trim() !== "");

  // Make sure we use empty arrays when data is undefined and filter valid items
  const companyItems = accessibleCompanies || [];
  const sectorItems = (sectors || [])
    .filter(s => (!selectedCompany || s.companyId === selectedCompany) && s.id && s.id.trim() !== "" && s.name && s.name.trim() !== "");
  const roleItems = (roles || [])
    .filter(r => (!selectedCompany || r.companyId === selectedCompany) && r.id && r.id.trim() !== "" && r.name && r.name.trim() !== "");

  // Status options with validation
  const statusOptions = [
    { value: "active", label: "Ativo" },
    { value: "inactive", label: "Inativo" },
    { value: "vacation", label: "Férias" },
    { value: "medical_leave", label: "Licença Médica" }
  ].filter(option => option.value && option.value.trim() !== "");
  
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
                value={field.value || "no-company-selected"}
                onValueChange={(value) => {
                  if (value !== "no-company-selected") {
                    field.onChange(value);
                    onCompanyChange(value);
                    
                    // Clear sector and role when company changes
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
                    companyItems
                      .filter(company => company.id && company.id.trim() !== "")
                      .map((company) => (
                        <SelectItem key={company.id} value={String(company.id)}>
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
      {/* Sector Select */}
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
                    sectorItems
                      .filter(sector => sector.id && sector.id.trim() !== "")
                      .map((sector) => (
                        <SelectItem key={sector.id} value={String(sector.id)}>
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
      {/* Role Select */}
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
                    roleItems
                      .filter(role => role.id && role.id.trim() !== "")
                      .map((role) => (
                        <SelectItem key={role.id} value={String(role.id)}>
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
      {/* statusOptions */}
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
                  {statusOptions
                    .filter(option => option.value && option.value.trim() !== "")
                    .map((option) => (
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
