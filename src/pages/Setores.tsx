
import { useState } from "react";
import { FolderKanban, PlusCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { SectorForm } from "@/components/sectors/SectorForm";
import { SectorCard, type SectorData } from "@/components/sectors/SectorCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";

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
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-72">
          <Select onValueChange={handleCompanyChange} value={selectedCompany || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma empresa" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          Selecione uma empresa para visualizar e gerenciar seus setores
        </p>
      </div>
      
      {selectedCompany && filteredSectors.length === 0 ? (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-center">
            <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum setor cadastrado</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Cadastre os setores da empresa para mapear riscos psicossociais 
              específicos e registrar incidentes relacionados.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Cadastrar Setor
            </Button>
          </div>
        </div>
      ) : !selectedCompany ? (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Selecione uma empresa</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Para visualizar e gerenciar setores, selecione uma empresa no menu acima.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSectors.map((sector) => (
            <SectorCard 
              key={sector.id} 
              sector={sector} 
              onClick={() => toast.info("Edição de setor será implementada em breve!")}
            />
          ))}
        </div>
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
