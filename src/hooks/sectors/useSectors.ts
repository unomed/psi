
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Sector {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  risk_level?: string;
  responsible_name?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

interface UseSectorsProps {
  companyId?: string;
}

export function useSectors({ companyId }: UseSectorsProps = {}) {
  const { data: sectors = [], isLoading, error } = useQuery({
    queryKey: ['sectors', companyId],
    queryFn: async (): Promise<Sector[]> => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .eq('company_id', companyId)
        .order('name');

      if (error) {
        console.error("Error fetching sectors:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!companyId
  });

  return {
    sectors,
    isLoading,
    error
  };
}
