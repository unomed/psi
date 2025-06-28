
export interface CompanyData {
  id: string;
  name: string;
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  industry?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  industry?: string;
  logoUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyAccess {
  companyId: string;
  companyName: string;
}
