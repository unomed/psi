import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { CompanySelector } from "@/components/assessments/selectors/CompanySelector";
import { SectorSelector } from "@/components/assessments/selectors/SectorSelector";
import { RoleSelector } from "@/components/assessments/selectors/RoleSelector";
import { useState } from "react";
import { EmployeeFormData } from "@/types/employee";

const employeeFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  birth_date: z.date().optional(),
  gender: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  start_date: z.date(),
  status: z.string().min(1, "Status é obrigatório"),
  special_conditions: z.string().optional().or(z.literal("")),
  photo_url: z.string().optional().or(z.literal("")),
  company_id: z.string().min(1, "Empresa é obrigatória"),
  sector_id: z.string().min(1, "Setor é obrigatório"),
  role_id: z.string().min(1, "Função é obrigatória"),
});

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

  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      birth_date: initialData.birth_date ? new Date(initialData.birth_date) : undefined,
      start_date: new Date(initialData.start_date),
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

  const handleSubmit = (values: z.infer<typeof employeeFormSchema>) => {
    const employeeData: EmployeeFormData = {
      name: values.name,
      cpf: values.cpf,
      email: values.email || undefined,
      phone: values.phone || undefined,
      birth_date: values.birth_date ? values.birth_date.toISOString() : undefined,
      gender: values.gender || undefined,
      address: values.address || undefined,
      start_date: values.start_date.toISOString(),
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de nascimento</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onSelect={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                    <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
                <Textarea {...field} />
              </FormControl>
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
                    setSelectedCompany(value);
                    setSelectedSector(null);
                    field.onChange(value);
                    form.setValue("sector_id", "");
                    form.setValue("role_id", "");
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
                    setSelectedSector(value);
                    field.onChange(value);
                    form.setValue("role_id", "");
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
