
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { EmployeeFormData } from "@/types/employee";
import { employeeFormSchema, EmployeeFormSchema } from "./schemas/employeeFormSchema";
import { PersonalInfoFields } from "./form-sections/PersonalInfoFields";
import { EmploymentFields } from "./form-sections/EmploymentFields";
import { AdditionalFields } from "./form-sections/AdditionalFields";
import { isValidDate } from "@/utils/dateUtils";

interface EmployeeFormProps {
  initialData?: EmployeeFormData & { id: string };
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
}

export function EmployeeForm({ initialData, onSubmit, onCancel }: EmployeeFormProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(
    initialData?.company_id || null
  );
  const [selectedSector, setSelectedSector] = useState<string | null>(
    initialData?.sector_id || null
  );

  // Helper function to safely parse dates
  const safeParseDate = (dateString?: string): Date | undefined => {
    if (!dateString) return undefined;
    
    const date = new Date(dateString);
    return isValidDate(date) ? date : undefined;
  };

  const form = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      birth_date: safeParseDate(initialData.birth_date),
      start_date: safeParseDate(initialData.start_date) || new Date(),
      // Garantir que campos opcionais nunca sejam null
      email: initialData.email || "",
      phone: initialData.phone || "",
      gender: initialData.gender || "",
      address: initialData.address || "",
      special_conditions: initialData.special_conditions || "",
      photo_url: initialData.photo_url || "",
    } : {
      name: "",
      cpf: "",
      email: "",
      phone: "",
      gender: "",
      address: "",
      status: "active",
      special_conditions: "",
      photo_url: "",
      start_date: new Date(),
    },
  });

  const handleSubmit = (values: EmployeeFormSchema) => {
    const employeeData: EmployeeFormData = {
      name: values.name,
      cpf: values.cpf,
      email: values.email || undefined,
      phone: values.phone || undefined,
      birth_date: values.birth_date && isValidDate(values.birth_date) 
        ? values.birth_date.toISOString() 
        : undefined,
      gender: values.gender || undefined,
      address: values.address || undefined,
      start_date: isValidDate(values.start_date) 
        ? values.start_date.toISOString() 
        : new Date().toISOString(),
      status: values.status,
      special_conditions: values.special_conditions || undefined,
      photo_url: values.photo_url || undefined,
      company_id: values.company_id,
      sector_id: values.sector_id,
      role_id: values.role_id,
    };
    
    onSubmit(employeeData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <EmploymentFields 
          form={form}
          selectedCompany={selectedCompany}
          selectedSector={selectedSector}
          onCompanyChange={setSelectedCompany}
          onSectorChange={setSelectedSector}
        />
        <AdditionalFields form={form} />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Salvar alterações" : "Cadastrar funcionário"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
