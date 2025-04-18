import { useState } from "react";
import { UserRound, PlusCircle, Building2, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleCard } from "@/components/roles/RoleCard";
import { RoleForm } from "@/components/roles/RoleForm";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";
import { useRoles } from "@/hooks/useRoles";
import { toast } from "sonner";
import type { RoleData } from "@/components/roles/RoleCard";

export default function Funcoes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  
  const { companies } = useCompanies();
  const { sectors } = useSectors();
  const { roles, isLoading, createRole } = useRoles();

  // Filter sectors based on selected company
  const filteredSectors = selectedCompany 
    ? sectors.filter(sector => sector.companyId === selectedCompany)
    : [];

  // Filter roles based on selected company and sector
  const filteredRoles = selectedSector 
    ? roles.filter(role => role.sectorId === selectedSector && role.companyId === selectedCompany)
    : [];

  const handleAddRole = async (data: Omit<RoleData, "id" | "companyId" | "sectorId">) => {
    if (!selectedCompany || !selectedSector) {
      toast.error("Selecione uma empresa e um setor");
      return;
    }
    
    try {
      await createRole.mutateAsync({
        ...data,
        companyId: selectedCompany,
        sectorId: selectedSector
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating role:", error);
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
          <h1 className="text-3xl font-bold tracking-tight">Funções</h1>
          <p className="text-muted-foreground mt-2">
            Descrições de funções e análise de riscos psicossociais associados.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Função
        </Button>
      </div>
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="space-y-4 w-full md:w-auto md:space-y-0 md:space-x-4 md:flex md:items-center">
          <div className="w-full md:w-64">
            <Select onValueChange={(companyId) => setSelectedCompany(companyId)} value={selectedCompany || undefined}>
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
          
          {selectedCompany && (
            <div className="w-full md:w-64">
              <Select onValueChange={(sectorId) => setSelectedSector(sectorId)} value={selectedSector || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um setor" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      
      {!selectedCompany ? (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Selecione uma empresa</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Para visualizar e gerenciar funções, primeiro selecione uma empresa no menu acima.
            </p>
          </div>
        </div>
      ) : !selectedSector ? (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-center">
            <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Selecione um setor</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Para visualizar e gerenciar funções, selecione um setor da empresa no menu acima.
            </p>
          </div>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-center">
            <UserRound className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhuma função cadastrada</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Cadastre as funções existentes neste setor com as habilidades requeridas
              e riscos psicossociais associados.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Cadastrar Função
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <RoleCard 
              key={role.id} 
              role={role} 
              onClick={() => toast.info("Edição de função será implementada em breve!")}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastro de Função</DialogTitle>
            <DialogDescription>
              Preencha os dados da função e as habilidades/competências necessárias.
            </DialogDescription>
          </DialogHeader>
          <RoleForm onSubmit={handleAddRole} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
