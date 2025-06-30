
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  logo_url?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

const mapCompanyData = (company: any): Company => ({
  id: company.id,
  name: company.name,
  cnpj: company.cnpj,
  email: company.email,
  phone: company.phone,
  address: company.address,
  city: company.city,
  state: company.state,
  industry: company.industry,
  logo_url: company.logo_url,
  contact_name: company.contact_name,
  contact_email: company.contact_email,
  contact_phone: company.contact_phone,
  created_at: company.created_at,
  updated_at: company.updated_at,
});

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<Company[]> => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) {
        console.error("Error fetching companies:", error);
        throw error;
      }

      return (data || []).map(mapCompanyData);
    }
  });
}
