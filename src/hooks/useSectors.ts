
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSectors() {
  const { data: sectors, isLoading } = useQuery({
    queryKey: ['sectors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('name');
      
      if (error) {
        toast.error('Erro ao carregar setores');
        throw error;
      }
      
      // Transform database response to match expected interface
      return data.map(sector => ({
        id: sector.id,
        name: sector.name,
        description: sector.description,
        companyId: sector.company_id,
        location: sector.location,
        responsibleName: sector.responsible_name,
        riskLevel: sector.risk_level,
        createdAt: new Date(sector.created_at),
        updatedAt: new Date(sector.updated_at)
      }));
    }
  });

  return { sectors: sectors || [], isLoading };
}
