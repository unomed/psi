
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyData } from "@/types";

export function useCompanies() {
  const { data: companies = [], isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<CompanyData[]> => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) throw error;
      
      return (data || []).map(company => ({
        ...company,
        notes: '', // Default empty notes since field doesn't exist in DB
        createdAt: new Date(company.created_at),
        updatedAt: new Date(company.updated_at)
      }));
    }
  });

  return { companies, isLoading, error };
}
