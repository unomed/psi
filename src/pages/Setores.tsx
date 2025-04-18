
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { SectorForm } from "@/components/sectors/SectorForm";
import type { SectorData } from "@/components/sectors/columns";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";
import { EmptySectorState } from "@/components/sectors/EmptySectorState";
import { SectorCompanySelect } from "@/components/sectors/SectorCompanySelect";
import { SectorTable } from "@/components/sectors/SectorTable";

export default function Setores() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [sectorToDelete, setSectorToDelete] = useState<SectorData | null>(null);
  const [sectorToEdit, setSectorToEdit] = useState<SectorData | null>(null);
  
  const { companies } = useCompanies();
  const { sectors, isLoading, createSector, updateSector, deleteSector } = useSectors();

  const filteredSectors = selectedCompany 
    ? sectors.filter(sector => sector.companyId === selectedCompany)
    : [];

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
  };

  const handleAddSector = async (data: Omit<SectorData, "id">) => {
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

  const handleEditSector = async (data: Omit<SectorData, "id">) => {
    if (!sectorToEdit) return;
    
    try {
      await updateSector.mutateAsync({
        ...sectorToEdit,
        ...data,
      });
      setSectorToEdit(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating sector:", error);
    }
  };

  const handleDeleteClick = (sector: SectorData) => {
    setSectorToDelete(sector);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sectorToDelete) return;
    
    try {
      await deleteSector.mutateAsync(sectorToDelete.id);
      setIsDeleteDialogOpen(false);
      setSectorToDelete(null);
    } catch (error) {
      console.error("Error deleting sector:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Setores</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os setores da empresa e seus níveis de risco psicossocial.
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
        <SectorTable 
          sectors={filteredSectors}
          isLoading={isLoading}
          onEdit={(sector) => {
            setSectorToEdit(sector);
            setIsDialogOpen(true);
          }}
          onDelete={handleDeleteClick}
          onView={(sector) => toast.info(`Visualização do setor ${sector.name} será implementada em breve!`)}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{sectorToEdit ? "Editar Setor" : "Cadastro de Setor"}</DialogTitle>
            <DialogDescription>
              {sectorToEdit 
                ? "Atualize as informações do setor conforme necessário."
                : "Preencha os dados do setor para cadastrá-lo na empresa selecionada."
              }
            </DialogDescription>
          </DialogHeader>
          <SectorForm 
            onSubmit={sectorToEdit ? handleEditSector : handleAddSector}
            defaultValues={sectorToEdit || undefined}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o setor "{sectorToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
