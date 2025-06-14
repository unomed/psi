
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSectors() {
  const queryClient = useQueryClient();

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

  const createSector = useMutation({
    mutationFn: async (sectorData: any) => {
      const { data, error } = await supabase
        .from('sectors')
        .insert({
          name: sectorData.name,
          description: sectorData.description,
          company_id: sectorData.companyId,
          location: sectorData.location,
          responsible_name: sectorData.responsibleName,
          risk_level: sectorData.riskLevel
        })
        .select()
        .single();

      if (error) {
        toast.error('Erro ao criar setor');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      toast.success('Setor criado com sucesso');
    },
  });

  const updateSector = useMutation({
    mutationFn: async (sectorData: any) => {
      const { data, error } = await supabase
        .from('sectors')
        .update({
          name: sectorData.name,
          description: sectorData.description,
          company_id: sectorData.companyId,
          location: sectorData.location,
          responsible_name: sectorData.responsibleName,
          risk_level: sectorData.riskLevel
        })
        .eq('id', sectorData.id)
        .select()
        .single();

      if (error) {
        toast.error('Erro ao atualizar setor');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      toast.success('Setor atualizado com sucesso');
    },
  });

  const deleteSector = useMutation({
    mutationFn: async (sectorId: string) => {
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', sectorId);

      if (error) {
        toast.error('Erro ao excluir setor');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      toast.success('Setor excluído com sucesso');
    },
  });

  return { 
    sectors: sectors || [], 
    isLoading,
    createSector,
    updateSector,
    deleteSector
  };
}
