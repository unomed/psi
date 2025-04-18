
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { SectorForm } from "@/components/sectors/SectorForm";
import type { SectorData } from "@/components/sectors/SectorCard";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";
import { EmptySectorState } from "@/components/sectors/EmptySectorState";
import { SectorCompanySelect } from "@/components/sectors/SectorCompanySelect";
import { SectorGrid } from "@/components/sectors/SectorGrid";

export default function Setores() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const { companies } = useCompanies();
  const { sectors, isLoading, createSector } = useSectors();

  const filteredSectors = selectedCompany 
    ? sectors.filter(sector => sector.companyId === selectedCompany)
    : [];

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
  };

  const handleAddSector = async (data: Omit<SectorData, "id" | "companyId">) => {
    if (!selectedCompany) {
      toast.error("Selecione uma empresa");
      return;
    }
    
    try {
      await createSector.mutateAsync({
        ...data,
        companyId: selectedCompany
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating sector:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Setores</h1>
          <p className="text-muted-foreground mt-2">
            Mapeamento e análise de riscos psicossociais específicos por setor.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Setor
        </Button>
      </div>
      
      <SectorCompanySelect 
        companies={companies}
        selectedCompany={selectedCompany}
        onCompanyChange={handleCompanyChange}
      />
      
      {selectedCompany && filteredSectors.length === 0 ? (
        <EmptySectorState 
          noCompanySelected={!selectedCompany} 
          onAddClick={() => setIsDialogOpen(true)}
        />
      ) : !selectedCompany ? (
        <EmptySectorState 
          noCompanySelected={true} 
          onAddClick={() => setIsDialogOpen(true)}
        />
      ) : (
        <SectorGrid 
          sectors={filteredSectors}
          onSectorClick={() => toast.info("Edição de setor será implementada em breve!")}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastro de Setor</DialogTitle>
            <DialogDescription>
              Preencha os dados do setor para cadastrá-lo na empresa selecionada.
            </DialogDescription>
          </DialogHeader>
          <SectorForm onSubmit={handleAddSector} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
