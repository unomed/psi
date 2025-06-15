
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
import { EmployeeTypeAndTagsFields } from "./form-sections/EmployeeTypeAndTagsFields";
import { useRoles } from "@/hooks/useRoles";
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
  const [selectedRole, setSelectedRole] = useState<string | null>(
    initialData?.role_id || null
  );

  const { roles } = useRoles();

  // Helper function to safely parse dates
  const safeParseDate = (dateString?: string): Date | undefined => {
    if (!dateString) return undefined;
    
    const date = new Date(dateString);
    return isValidDate(date) ? date : undefined;
  };

  // Helper function to safely parse employee_tags - garante que sempre retorna string[]
  const safeParseEmployeeTags = (tags?: any): string[] => {
    // Se não há tags, retornar array vazio
    if (!tags) return [];
    
    // Se já é um array, filtrar para garantir que são strings
    if (Array.isArray(tags)) {
      return tags.filter((tag): tag is string => typeof tag === 'string');
    }
    
    // Se é uma string, tentar fazer parse como JSON
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          return parsed.filter((tag): tag is string => typeof tag === 'string');
        }
      } catch {
        // Se o parse falhar, retornar array vazio
        return [];
      }
    }
    
    // Para qualquer outro tipo, retornar array vazio
    return [];
  };

  const form = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      birth_date: safeParseDate(initialData.birth_date),
      start_date: safeParseDate(initialData.start_date) || new Date(),
      employee_type: initialData.employee_type || "funcionario",
      employee_tags: safeParseEmployeeTags(initialData.employee_tags),
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
      employee_type: "funcionario",
      employee_tags: [],
    },
  });

  // Encontrar tags obrigatórias da função selecionada
  const selectedRoleData = roles?.find(role => role.id === selectedRole);
  const requiredTags = selectedRoleData?.required_tags || [];

  const handleSubmit = (values: EmployeeFormSchema) => {
    // Garantir que employee_tags seja sempre string[] usando a função helper
    const employeeTags = safeParseEmployeeTags(values.employee_tags);
    
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
      employee_type: values.employee_type,
      // Type assertion segura: banco de dados garante que employee_tags é sempre string[] após migração
      employee_tags: values.employee_tags as string[],
    };
    
    onSubmit(employeeData);
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    form.setValue("role_id", roleId);
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
          onRoleChange={handleRoleChange}
        />
        <EmployeeTypeAndTagsFields 
          form={form}
          selectedRole={selectedRole}
          requiredTags={requiredTags}
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
