
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { SectorGrid } from "@/components/sectors/SectorGrid";
import { SectorForm } from "@/components/sectors/SectorForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSectors } from "@/hooks/useSectors";

export default function Setores() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;
  const { sectors, isLoading, createSector, updateSector, deleteSector } = useSectors(companyId);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setIsEditMode(false);
    setSelectedSector(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEditMode(false);
    setSelectedSector(null);
  };

  const handleEditSector = (sector: any) => {
    setSelectedSector(sector);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDeleteSector = async (sector: any) => {
    if (!window.confirm(`Tem certeza que deseja excluir o setor "${sector.name}"?`)) {
      return;
    }

    try {
      await deleteSector.mutateAsync(sector.id);
      toast.success("Setor excluído com sucesso!");
    } catch (err) {
      toast.error("Erro ao excluir setor.");
    }
  };

  const handleSubmit = async (sectorData: any) => {
    try {
      if (isEditMode) {
        await updateSector.mutateAsync({ ...sectorData, id: selectedSector?.id });
        toast.success("Setor atualizado com sucesso!");
      } else {
        await createSector.mutateAsync(sectorData);
        toast.success("Setor criado com sucesso!");
      }
      handleCloseForm();
    } catch (err) {
      toast.error("Erro ao salvar setor.");
    }
  };

  const filteredSectors = sectors?.filter(sector =>
    sector.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Setores</h1>
          <p className="text-muted-foreground">
            Gerencie os setores da sua empresa
          </p>
        </div>
        <Button onClick={handleOpenForm}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Setor
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Buscar setor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent>Carregando setores...</CardContent>
        </Card>
      ) : filteredSectors && filteredSectors.length > 0 ? (
        <SectorGrid
          sectors={filteredSectors}
          onSectorClick={handleEditSector}
        />
      ) : (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhum setor encontrado</p>
              <Button onClick={handleOpenForm}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Setor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Editar Setor" : "Novo Setor"}</DialogTitle>
          </DialogHeader>
          <SectorForm
            onSubmit={handleSubmit}
            initialData={selectedSector}
            isEdit={isEditMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
