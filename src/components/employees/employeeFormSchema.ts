
import { z } from "zod";

export const employeeFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
  company_id: z.string().min(1, "Empresa é obrigatória"),
  sector_id: z.string().min(1, "Setor é obrigatório"),
  role_id: z.string().min(1, "Função é obrigatória"),
  birthdate: z.string().optional(),
  gender: z.string().optional(),
  start_date: z.string().min(1, "Data de início é obrigatória"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  status: z.string().min(1, "Status é obrigatório"),
  employee_type: z.string().optional(),
  special_conditions: z.string().optional(),
  photo_url: z.string().optional(),
  employee_tags: z.string().optional()
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
