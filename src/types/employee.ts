
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
  company_id: string;
  sector_id: string;
  role_id: string;
  employee_type: 'funcionario' | 'candidato';
  employee_tags: string[]; // Keep for backward compatibility
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
  created_at: string;
  updated_at: string;
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
  sector_id: string;
  role_id: string;
  employee_type: 'funcionario' | 'candidato';
  employee_tags: string[]; // Keep for backward compatibility
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
