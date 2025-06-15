
export interface EmployeeTagType {
  id: string;
  name: string;
  description?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeTag {
  id: string;
  employee_id: string;
  tag_type_id: string;
  acquired_date?: string;
  expiry_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  tag_type?: EmployeeTagType;
}

export interface RoleRequiredTag {
  id: string;
  role_id: string;
  tag_type_id: string;
  is_mandatory: boolean;
  created_at: string;
  tag_type?: EmployeeTagType;
}
