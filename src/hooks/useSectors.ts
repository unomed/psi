
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
      
      return data;
    }
  });

  return { sectors, isLoading };
}
