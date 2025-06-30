import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Employee, EmployeeFormData } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/hooks/useAuth";
import { useSectors } from "@/hooks/useSectors";
import { useRoles } from "@/hooks/useRoles";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const employeeFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  cpf: z.string().length(14, {
    message: "CPF deve ter 11 dígitos.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }).optional(),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  start_date: z.string(),
  status: z.string().optional(),
  special_conditions: z.string().optional(),
  photo_url: z.string().optional(),
  company_id: z.string(),
  sector_id: z.string(),
  role_id: z.string(),
  employee_type: z.enum(['funcionario', 'candidato']),
  employee_tags: z.array(z.string()).optional(),
});

interface EmployeeFormProps {
  employee?: Employee;
  onCancel?: () => void;
}

export function EmployeeForm({ employee, onCancel }: EmployeeFormProps) {
  const [isNewEmployee, setIsNewEmployee] = useState(!employee);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { sectors } = useSectors(user?.user_metadata?.companyId);
  const { roles } = useRoles(user?.user_metadata?.companyId);

  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: employee?.name || "",
      cpf: employee?.cpf || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      birth_date: employee?.birth_date || "",
      gender: employee?.gender || "",
      address: employee?.address || "",
      start_date: employee?.start_date || "",
      status: employee?.status || "ativo",
      special_conditions: employee?.special_conditions || "",
      photo_url: employee?.photo_url || "",
      company_id: employee?.company_id || user?.user_metadata?.companyId || "",
      sector_id: employee?.sector_id || "",
      role_id: employee?.role_id || "",
      employee_type: employee?.employee_type || "funcionario",
      employee_tags: employee?.employee_tags || [],
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof employeeFormSchema>) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const payload: EmployeeFormData = {
        name: values.name,
        cpf: values.cpf,
        email: values.email,
        phone: values.phone,
        birth_date: values.birth_date,
        gender: values.gender,
        address: values.address,
        start_date: values.start_date,
        status: values.status || 'ativo',
        special_conditions: values.special_conditions,
        photo_url: values.photo_url,
        company_id: values.company_id,
        sector_id: values.sector_id,
        role_id: values.role_id,
        employee_type: values.employee_type,
        employee_tags: values.employee_tags || [],
      };

      let result;

      if (isNewEmployee) {
        result = await supabase
          .from('employees')
          .insert([payload]);
      } else {
        result = await supabase
          .from('employees')
          .update(payload)
          .eq('id', employee?.id);
      }

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success(`Funcionário ${isNewEmployee ? 'criado' : 'atualizado'} com sucesso!`);
      navigate('/funcionarios');
    },
    onError: (error: any) => {
      toast.error(`Erro ao ${isNewEmployee ? 'criar' : 'atualizar'} funcionário: ${error.message}`);
    },
  })

  function onSubmit(values: z.infer<typeof employeeFormSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: John Doe" {...field} />
              </FormControl>
              <FormDescription>
                Este é o nome completo do funcionário.
              </FormDescription>
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
                <Input placeholder="Ex: 000.000.000-00" {...field} />
              </FormControl>
              <FormDescription>
                O número de identificação do funcionário.
              </FormDescription>
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
                <Input placeholder="Ex: john.doe@example.com" type="email" {...field} />
              </FormControl>
              <FormDescription>
                O endereço de email do funcionário.
              </FormDescription>
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
                <Input placeholder="Ex: (00) 00000-0000" {...field} />
              </FormControl>
              <FormDescription>
                O número de telefone do funcionário.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                A data de nascimento do funcionário.
              </FormDescription>
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
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                O gênero do funcionário.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Rua Exemplo, 123"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                O endereço completo do funcionário.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Início</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                A data de início do funcionário na empresa.
              </FormDescription>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="afastado">Afastado</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                O status atual do funcionário na empresa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="special_conditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condições Especiais</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Necessidades especiais"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Quaisquer condições especiais do funcionário.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Foto</FormLabel>
              <FormControl>
                <Input type="url" placeholder="Ex: https://example.com/photo.jpg" {...field} />
              </FormControl>
              <FormDescription>
                URL da foto do funcionário.
              </FormDescription>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors?.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                O setor ao qual o funcionário pertence.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                O cargo que o funcionário ocupa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="employee_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Funcionário</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funcionario">Funcionário</SelectItem>
                    <SelectItem value="candidato">Candidato</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                O tipo de funcionário.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
