
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
  role?: {
    id: string;
    name: string;
    risk_level?: string;
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
}
