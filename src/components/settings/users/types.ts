
export type UserFormData = {
  email: string;
  full_name: string;
  role: "superadmin" | "admin" | "evaluator" | "profissionais";
  companyIds?: string[];
};
