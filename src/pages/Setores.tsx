
import { useState } from "react";
import { useSectors } from "@/hooks/nr01/useSectors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SectorGrid } from "@/components/sectors/SectorGrid";
import { SectorForm } from "@/components/sectors/SectorForm";
import { EmptySectorState } from "@/components/sectors/EmptySectorState";
import { SectorCompanySelect } from "@/components/sectors/SectorCompanySelect";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";

export default function Setores() {
  const { sectors, isLoading } = useSectors();
  const { userCompanies } = useSimpleAuth();
  const queryClient = useQueryClient();
  
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<any>(null);

  const createSector = useMutation({
    mutationFn: async (sectorData: any) => {
      const { data, error } = await supabase
        .from('sectors')
        .insert([{
          name: sectorData.name,
          description: sectorData.description,
          company_id: sectorData.company_id,
          risk_level: sectorData.risk_level
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      toast.success('Setor criado com sucesso!');
      setIsCreateDialogOpen(false);
    }
  });

  const updateSector = useMutation({
    mutationFn: async (sectorData: any) => {
      const { data, error } = await supabase
        .from('sectors')
        .update({
          name: sectorData.name,
          description: sectorData.description,
          risk_level: sectorData.risk_level
        })
        .eq('id', sectorData.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      toast.success('Setor atualizado com sucesso!');
      setIsEditDialogOpen(false);
    }
  });

  const deleteSector = useMutation({
    mutationFn: async (sectorId: string) => {
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', sectorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      toast.success('Setor excluído com sucesso!');
    }
  });

  const filteredSectors = selectedCompany 
    ? sectors?.filter(sector => sector.company_id === selectedCompany)
    : [];

  const handleCreateSector = async (sectorData: any) => {
    await createSector.mutateAsync({ ...sectorData, company_id: selectedCompany });
  };

  const handleEditSector = async (sectorData: any) => {
    await updateSector.mutateAsync(sectorData);
  };

  const handleDeleteSector = async (sectorId: string) => {
    await deleteSector.mutateAsync(sectorId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Setores</h1>
          <p className="text-muted-foreground">
            Gerenciamento de setores organizacionais
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} disabled={!selectedCompany}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Setor
        </Button>
      </div>

      <SectorCompanySelect
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
        userCompanies={userCompanies}
      />

      {!selectedCompany ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">Selecione uma empresa para visualizar os setores</p>
        </div>
      ) : !filteredSectors?.length ? (
        <EmptySectorState onCreateClick={() => setIsCreateDialogOpen(true)} />
      ) : (
        <SectorGrid
          sectors={filteredSectors}
          onEdit={(sector) => {
            setSelectedSector(sector);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDeleteSector}
        />
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Setor</DialogTitle>
          </DialogHeader>
          <SectorForm
            onSubmit={handleCreateSector}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Setor</DialogTitle>
          </DialogHeader>
          <SectorForm
            sector={selectedSector}
            onSubmit={handleEditSector}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
