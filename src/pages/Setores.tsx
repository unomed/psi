import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { SectorGrid } from "@/components/sectors/SectorGrid";
import { SectorForm } from "@/components/sectors/SectorForm";
import { SectorCompanySelect } from "@/components/sectors/SectorCompanySelect";
import { EmptySectorState } from "@/components/sectors/EmptySectorState";  
import { useSectors } from "@/hooks/sectors/useSectors";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function Setores() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;
  const { sectors, isLoading, error, createSector, updateSector, deleteSector, refetch } = useSectors(companyId);
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

  const handleEditSector = (sector) => {
    setSelectedSector(sector);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDeleteSector = async (sector) => {
    if (!window.confirm(`Tem certeza que deseja excluir o setor "${sector.name}"?`)) {
      return;
    }

    try {
      await deleteSector(sector.id);
      toast.success("Setor excluído com sucesso!");
      refetch();
    } catch (err) {
      toast.error("Erro ao excluir setor.");
    }
  };

  const handleSubmit = async (sectorData) => {
    try {
      if (isEditMode) {
        await updateSector({ ...sectorData, id: selectedSector.id });
        toast.success("Setor atualizado com sucesso!");
      } else {
        await createSector(sectorData);
        toast.success("Setor criado com sucesso!");
      }
      handleCloseForm();
      refetch();
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
      ) : error ? (
        <Card>
          <CardContent>Erro ao carregar setores.</CardContent>
        </Card>
      ) : filteredSectors && filteredSectors.length > 0 ? (
        <SectorGrid
          sectors={filteredSectors}
          onEdit={handleEditSector}
          onDelete={handleDeleteSector}
        />
      ) : (
        <EmptySectorState onCreate={handleOpenForm} />
      )}

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Editar Setor" : "Novo Setor"}</DialogTitle>
          </DialogHeader>
          <SectorForm
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            initialValues={selectedSector}
            isEditMode={isEditMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
