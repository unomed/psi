
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useCompanies() {
  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) {
        toast.error('Erro ao carregar empresas');
        throw error;
      }
      
      // Transform database response to match expected interface
      return data.map(company => ({
        id: company.id,
        name: company.name,
        cnpj: company.cnpj,
        email: company.email,
        phone: company.phone,
        address: company.address,
        city: company.city,
        state: company.state,
        industry: company.industry,
        logoUrl: company.logo_url,
        contactName: company.contact_name,
        contactEmail: company.contact_email,
        contactPhone: company.contact_phone,
        createdAt: new Date(company.created_at),
        updatedAt: new Date(company.updated_at)
      }));
    }
  });

  return { companies: companies || [], isLoading };
}
