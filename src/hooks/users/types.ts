export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "superadmin" | "admin" | "evaluator" | "profissionais";
  companies: string[];
  is_active: boolean;
}

export interface ProfileWithEmail {
  id: string;
  email?: string;
  full_name?: string;
}

export interface UpdateUserRoleParams {
  userId: string;
  role: string;
  companyIds?: string[];
}

export interface CreateUserParams {
  email: string;
  full_name: string;
  role: string;
  companyIds?: string[];
}
