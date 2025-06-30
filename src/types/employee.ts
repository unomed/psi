
export interface Employee {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  start_date: string;
  status: string;
  special_conditions?: string;
  photo_url?: string;
  employee_type: 'funcionario' | 'candidato';
  employee_tags: string[];
  company_id: string;
  sector_id?: string;                     // ✅ Manter opcional
  role_id?: string;
  created_at: string;
  updated_at: string;
  
  // ✅ ADICIONAR - propriedades faltando para relacionamentos:
  role?: {
    id: string;
    name: string;
    risk_level?: string;
    required_tags?: string[];
  };
  sectors?: {
    id: string;
    name: string;
  };
}

export interface EmployeeFormData {
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  start_date: string;
  status: string;
  special_conditions?: string;
  photo_url?: string;
  company_id: string;
  sector_id: string;                      // ✅ Manter obrigatório aqui
  role_id: string;
  employee_type: 'funcionario' | 'candidato';
  employee_tags: string[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  sector_id: string;
  required_skills?: string[];
  risk_level?: string;
  required_tags: string[];
  created_at: string;
  updated_at: string;
}
