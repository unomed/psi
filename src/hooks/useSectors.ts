
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SectorData } from "@/components/sectors/columns";

export function useSectors() {
  const queryClient = useQueryClient();

  const { data: sectors = [], isLoading } = useQuery({
    queryKey: ["sectors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sectors")
        .select(`
          id,
          name,
          description,
          location,
          risk_level,
          responsible_name,
          company_id
        `)
        .order("name");

      if (error) {
        toast.error("Erro ao carregar setores");
        throw error;
      }

      return data.map(sector => ({
        id: sector.id,
        name: sector.name,
        description: sector.description,
        location: sector.location,
        riskLevel: sector.risk_level,
        responsibleName: sector.responsible_name,
        companyId: sector.company_id
      })) as SectorData[];
    },
  });

  const createSector = useMutation({
    mutationFn: async (newSector: Omit<SectorData, "id">) => {
      const { data, error } = await supabase
        .from("sectors")
        .insert([{
          name: newSector.name,
          description: newSector.description,
          location: newSector.location,
          risk_level: newSector.riskLevel,
          responsible_name: newSector.responsibleName,
          company_id: newSector.companyId
        }])
        .select()
        .single();

      if (error) {
        toast.error("Erro ao criar setor");
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        location: data.location,
        riskLevel: data.risk_level,
        responsibleName: data.responsible_name,
        companyId: data.company_id
      } as SectorData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
      toast.success("Setor criado com sucesso!");
    },
  });

  const updateSector = useMutation({
    mutationFn: async (sector: SectorData) => {
      const { error } = await supabase
        .from("sectors")
        .update({
          name: sector.name,
          description: sector.description,
          location: sector.location,
          risk_level: sector.riskLevel,
          responsible_name: sector.responsibleName,
          company_id: sector.companyId
        })
        .eq("id", sector.id);

      if (error) {
        toast.error("Erro ao atualizar setor");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
      toast.success("Setor atualizado com sucesso!");
    },
  });

  const deleteSector = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sectors")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Erro ao deletar setor");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
      toast.success("Setor removido com sucesso!");
    },
  });

  return {
    sectors,
    isLoading,
    createSector,
    updateSector,
    deleteSector,
  };
}
