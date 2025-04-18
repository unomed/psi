
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCompanies } from "@/hooks/useCompanies";
import { useSectors } from "@/hooks/useSectors";
import { useRoles } from "@/hooks/useRoles";
import { toast } from "sonner";
import { RoleForm } from "@/components/roles/RoleForm";
import { EmptyRoleState } from "@/components/roles/EmptyRoleState";
import { RoleCompanySelect } from "@/components/roles/RoleCompanySelect";
import { RoleGrid } from "@/components/roles/RoleGrid";
import type { RoleData } from "@/components/roles/RoleCard";

export default function Funcoes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  
  const { companies } = useCompanies();
  const { sectors } = useSectors();
  const { roles, isLoading, createRole } = useRoles();

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
      
      <RoleCompanySelect
        companies={companies}
        selectedCompany={selectedCompany}
        selectedSector={selectedSector}
        sectors={sectors}
        onCompanyChange={setSelectedCompany}
        onSectorChange={setSelectedSector}
      />
      
      {!selectedCompany || !selectedSector ? (
        <EmptyRoleState 
          noCompanySelected={!selectedCompany}
          noSectorSelected={!selectedSector}
          onAddClick={() => setIsDialogOpen(true)}
        />
      ) : filteredRoles.length === 0 ? (
        <EmptyRoleState 
          noCompanySelected={false}
          noSectorSelected={false}
          onAddClick={() => setIsDialogOpen(true)}
        />
      ) : (
        <RoleGrid 
          roles={filteredRoles}
          onRoleClick={() => toast.info("Edição de função será implementada em breve!")}
        />
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
