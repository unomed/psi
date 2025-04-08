
import { useState } from "react";
import { UserRound, PlusCircle, Building2, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanyData } from "@/components/companies/CompanyCard";
import { SectorData } from "@/components/sectors/SectorCard";
import { RoleCard, RoleData } from "@/components/roles/RoleCard";
import { RoleForm } from "@/components/roles/RoleForm";

// Mock data for companies (in a real app, this would come from a database)
const mockCompanies: CompanyData[] = [
  {
    id: "company-1",
    name: "Empresa ABC Ltda",
    cnpj: "12.345.678/0001-90",
    address: "Rua Principal, 123",
    city: "São Paulo",
    state: "SP",
    industry: "Tecnologia da Informação",
    contactName: "João Silva",
    contactEmail: "joao.silva@abc.com",
    contactPhone: "(11) 98765-4321"
  },
  {
    id: "company-2",
    name: "Indústria XYZ S.A.",
    cnpj: "98.765.432/0001-10",
    address: "Av. Industrial, 456",
    city: "Belo Horizonte",
    state: "MG",
    industry: "Manufatura",
    contactName: "Maria Oliveira",
    contactEmail: "maria.o@xyz.com.br",
    contactPhone: "(31) 91234-5678"
  }
];

// Mock data for sectors (in a real app, this would come from a database)
const mockSectors: SectorData[] = [
  {
    id: "sector-1",
    name: "Desenvolvimento",
    description: "Equipe de desenvolvimento de software",
    location: "2º andar",
    riskLevel: "Médio",
    companyId: "company-1"
  },
  {
    id: "sector-2",
    name: "Suporte",
    description: "Suporte técnico ao cliente",
    location: "Térreo",
    riskLevel: "Baixo",
    companyId: "company-1"
  },
  {
    id: "sector-3",
    name: "Produção",
    description: "Linha de produção principal",
    location: "Galpão 3",
    riskLevel: "Alto",
    companyId: "company-2"
  }
];

export default function Funcoes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [roles, setRoles] = useState<RoleData[]>([]);

  // Filter sectors based on selected company
  const filteredSectors = selectedCompany 
    ? mockSectors.filter(sector => sector.companyId === selectedCompany)
    : [];

  // Filter roles based on selected company and sector
  const filteredRoles = selectedSector 
    ? roles.filter(role => role.sectorId === selectedSector && role.companyId === selectedCompany)
    : [];

  const handleAddRole = (data: Omit<RoleData, "id" | "companyId" | "sectorId">) => {
    if (!selectedCompany || !selectedSector) {
      toast.error("Selecione uma empresa e um setor antes de adicionar uma função");
      return;
    }
    
    const newRole = {
      ...data,
      id: `role-${Date.now()}`,
      companyId: selectedCompany,
      sectorId: selectedSector
    };
    
    setRoles([...roles, newRole]);
    setIsDialogOpen(false);
    toast.success("Função cadastrada com sucesso!");
  };

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    setSelectedSector(null); // Reset sector selection when company changes
  };

  const handleSectorChange = (sectorId: string) => {
    setSelectedSector(sectorId);
  };

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
            <Select onValueChange={handleCompanyChange} value={selectedCompany || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {mockCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCompany && (
            <div className="w-full md:w-64">
              <Select onValueChange={handleSectorChange} value={selectedSector || undefined}>
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
