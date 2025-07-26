
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { SectorForm } from "@/components/sectors/SectorForm";
import type { SectorData } from "@/components/sectors/columns";
import { useSectors } from "@/hooks/useSectors";
import { EmptySectorState } from "@/components/sectors/EmptySectorState";
import { SectorTable } from "@/components/sectors/SectorTable";
import { useCompany } from "@/contexts/CompanyContext";
import { FadeIn } from "@/components/ui/fade-in";
import { PageTransition } from "@/components/ui/page-transition";

export default function Setores() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sectorToDelete, setSectorToDelete] = useState<SectorData | null>(null);
  const [sectorToEdit, setSectorToEdit] = useState<SectorData | null>(null);
  
  const { selectedCompanyId } = useCompany();
  const { sectors, isLoading, createSector, updateSector, deleteSector } = useSectors();

  // Filter sectors based on selected company
  const filteredSectors = selectedCompanyId 
    ? sectors.filter(sector => sector.companyId === selectedCompanyId)
    : [];

  const handleAddSector = async (data: Omit<SectorData, "id">) => {
    if (!selectedCompanyId) {
      toast.error("Selecione uma empresa no cabeçalho");
      return;
    }
    
    try {
      await createSector.mutateAsync({
        ...data,
        companyId: selectedCompanyId
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
    <PageTransition>
      <div className="space-y-6 sm:space-y-8">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Setores</h1>
              <p className="text-muted-foreground">
                Gerencie os setores da empresa e seus níveis de risco psicossocial.
              </p>
            </div>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Setor
            </Button>
          </div>
        </FadeIn>
        
        <FadeIn delay={200}>
          {!selectedCompanyId ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">Selecione uma empresa no cabeçalho para visualizar os setores</p>
            </div>
          ) : selectedCompanyId && filteredSectors.length === 0 ? (
            <EmptySectorState 
              noCompanySelected={false} 
              onAddClick={() => setIsDialogOpen(true)}
            />
          ) : (
            <div className="bg-card rounded-lg border transition-all duration-300 hover:shadow-lg">
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
            </div>
          )}
        </FadeIn>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
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
          <AlertDialogContent className="animate-in slide-in-from-bottom-4 duration-300">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o setor "{sectorToDelete?.name}"?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="transition-all duration-200 hover:scale-105"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTransition>
  );
}
