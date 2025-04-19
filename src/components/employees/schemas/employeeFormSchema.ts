
import { z } from "zod";

export const employeeFormSchema = z.object({
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

export type EmployeeFormSchema = z.infer<typeof employeeFormSchema>;
