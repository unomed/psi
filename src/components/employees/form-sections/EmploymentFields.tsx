
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormSchema } from "../schemas/employeeFormSchema";
import { useEffect, useState } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";
import { useRoles } from "@/hooks/useRoles";
import { SearchableSelect, Option } from "@/components/ui/searchable-select";
import { DatePicker } from "@/components/ui/date-picker";

interface EmploymentFieldsProps {
  form: UseFormReturn<EmployeeFormSchema>;
  selectedCompany: string | null;
  selectedSector: string | null;
  onCompanyChange: (companyId: string | null) => void;
  onSectorChange: (sectorId: string | null) => void;
}

const statusOptions = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
  { value: "vacation", label: "Férias" },
  { value: "medical_leave", label: "Licença médica" },
];

export function EmploymentFields({
  form,
  selectedCompany,
  selectedSector,
  onCompanyChange,
  onSectorChange,
}: EmploymentFieldsProps) {
  const { companies, isLoading: isLoadingCompanies } = useCompanies();
  const { sectors, isLoading: isLoadingSectors } = useSectors(selectedCompany);
  const { roles, isLoading: isLoadingRoles } = useRoles(selectedSector);
  
  const [companyOptions, setCompanyOptions] = useState<Option[]>([]);
  const [sectorOptions, setSectorOptions] = useState<Option[]>([]);
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);

  // Atualiza as opções de empresas
  useEffect(() => {
    if (companies) {
      setCompanyOptions(
        companies.map((company) => ({
          value: company.id,
          label: company.name,
        }))
      );
    }
  }, [companies]);

  // Atualiza as opções de setores
  useEffect(() => {
    if (sectors) {
      setSectorOptions(
        sectors.map((sector) => ({
          value: sector.id,
          label: sector.name,
        }))
      );
    } else {
      setSectorOptions([]);
    }
  }, [sectors]);

  // Atualiza as opções de funções
  useEffect(() => {
    if (roles) {
      setRoleOptions(
        roles.map((role) => ({
          value: role.id,
          label: role.name,
        }))
      );
    } else {
      setRoleOptions([]);
    }
  }, [roles]);

  // Quando a empresa muda, atualiza o callback
  const handleCompanyChange = (value: string) => {
    form.setValue("sector_id", "");
    form.setValue("role_id", "");
    onCompanyChange(value);
  };

  // Quando o setor muda, atualiza o callback
  const handleSectorChange = (value: string) => {
    form.setValue("role_id", "");
    onSectorChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Admissão</FormLabel>
              <DatePicker
                selected={field.value}
                onSelect={field.onChange}
              />
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
                <SearchableSelect
                  options={statusOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Selecione o status"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="company_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={companyOptions}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCompanyChange(value);
                  }}
                  placeholder="Selecione a empresa"
                  loading={isLoadingCompanies}
                  disabled={isLoadingCompanies}
                />
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
                <SearchableSelect
                  options={sectorOptions}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSectorChange(value);
                  }}
                  placeholder="Selecione o setor"
                  loading={isLoadingSectors}
                  disabled={!selectedCompany || isLoadingSectors}
                />
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
                <SearchableSelect
                  options={roleOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Selecione a função"
                  loading={isLoadingRoles}
                  disabled={!selectedSector || isLoadingRoles}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
